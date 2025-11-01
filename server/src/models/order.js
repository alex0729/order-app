const { query } = require('../config/database');
const { decreaseStock } = require('./menu');

/**
 * 주문 번호 생성 (ORD-YYYYMMDD-XXX 형식)
 */
const generateOrderNumber = async () => {
  try {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    // 오늘 날짜의 주문 개수 조회
    const countResult = await query(
      `SELECT COUNT(*) as count
       FROM orders
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    
    const count = parseInt(countResult.rows[0].count) + 1;
    const orderNumber = `ORD-${dateStr}-${String(count).padStart(3, '0')}`;
    
    return orderNumber;
  } catch (error) {
    console.error('Error in generateOrderNumber:', error);
    throw error;
  }
};

/**
 * 주문 생성
 */
const createOrder = async (orderData) => {
  const client = await require('../config/database').pool.connect();
  
  try {
    await client.query('BEGIN');

    // 주문 번호 생성
    const orderNumber = await generateOrderNumber();

    // 주문 총액 계산
    let totalAmount = 0;
    for (const item of orderData.items) {
      // 메뉴 가격 조회
      const menuResult = await client.query(
        'SELECT price FROM menus WHERE id = $1',
        [item.menu_id]
      );

      if (menuResult.rows.length === 0) {
        throw new Error(`Menu not found: ${item.menu_id}`);
      }

      const basePrice = parseFloat(menuResult.rows[0].price);
      
      // 옵션 가격 추가
      let itemTotal = basePrice;
      if (item.selected_options && item.selected_options.length > 0) {
        for (const option of item.selected_options) {
          if (option.option_id) {
            const optionResult = await client.query(
              'SELECT price_modifier FROM options WHERE id = $1',
              [option.option_id]
            );
            if (optionResult.rows.length > 0) {
              itemTotal += parseFloat(optionResult.rows[0].price_modifier);
            }
          }
        }
      }

      totalAmount += itemTotal * item.quantity;

      // 재고 확인 및 차감
      const stockResult = await client.query(
        'SELECT stock_quantity FROM menus WHERE id = $1',
        [item.menu_id]
      );

      if (stockResult.rows.length === 0) {
        throw new Error(`Menu not found: ${item.menu_id}`);
      }

      const currentStock = parseInt(stockResult.rows[0].stock_quantity);
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for menu ${item.menu_id}. Available: ${currentStock}, Requested: ${item.quantity}`);
      }
    }

    // 주문 생성
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, total_amount, status, customer_name, customer_phone, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, order_number, order_datetime, total_amount, status, created_at`,
      [
        orderNumber,
        totalAmount,
        orderData.status || '접수',
        orderData.customer_name || null,
        orderData.customer_phone || null,
        orderData.special_requests || null
      ]
    );

    const order = orderResult.rows[0];
    const orderId = order.id;

    // 주문 항목 생성 및 재고 차감
    const orderItems = [];
    for (const item of orderData.items) {
      // 메뉴 정보 조회
      const menuResult = await client.query(
        'SELECT price FROM menus WHERE id = $1',
        [item.menu_id]
      );
      const basePrice = parseFloat(menuResult.rows[0].price);

      // 옵션 가격 계산
      let unitPrice = basePrice;
      if (item.selected_options && item.selected_options.length > 0) {
        for (const option of item.selected_options) {
          if (option.option_id) {
            const optionResult = await client.query(
              'SELECT price_modifier FROM options WHERE id = $1',
              [option.option_id]
            );
            if (optionResult.rows.length > 0) {
              unitPrice += parseFloat(optionResult.rows[0].price_modifier);
            }
          }
        }
      }

      const itemTotalPrice = unitPrice * item.quantity;

      // 주문 항목 생성
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price, selected_options)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, menu_id, quantity, unit_price, total_price`,
        [
          orderId,
          item.menu_id,
          item.quantity,
          unitPrice,
          itemTotalPrice,
          JSON.stringify(item.selected_options || [])
        ]
      );

      orderItems.push(itemResult.rows[0]);

      // 재고 차감은 제조 완료 시점에 수행됩니다.
    }

    await client.query('COMMIT');

    return {
      ...order,
      items: orderItems
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createOrder:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 주문 목록 조회
 */
const getAllOrders = async (filters = {}) => {
  try {
    let queryStr = `
      SELECT id, order_number, order_datetime, total_amount, status, 
             customer_name, customer_phone, special_requests, created_at, updated_at
      FROM orders
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      queryStr += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    queryStr += ' ORDER BY created_at DESC';

    if (filters.limit) {
      queryStr += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.offset) {
      queryStr += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await query(queryStr, params);
    return result.rows;
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw error;
  }
};

/**
 * 특정 주문 조회 (상세 정보 포함)
 */
const getOrderById = async (orderId) => {
  try {
    // 주문 정보 조회
    const orderResult = await query(
      `SELECT id, order_number, order_datetime, total_amount, status, 
              customer_name, customer_phone, special_requests, created_at, updated_at
       FROM orders
       WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    // 주문 항목 조회
    const itemsResult = await query(
      `SELECT oi.id, oi.menu_id, oi.quantity, oi.unit_price, oi.total_price, oi.selected_options,
              m.name as menu_name
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [orderId]
    );

    return {
      ...order,
      items: itemsResult.rows.map(item => ({
        ...item,
        selected_options: item.selected_options ? JSON.parse(item.selected_options) : []
      }))
    };
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

/**
 * 주문 상태 변경
 */
const updateOrderStatus = async (orderId, status) => {
  const client = await require('../config/database').pool.connect();
  
  try {
    await client.query('BEGIN');

    // 유효한 상태인지 확인
    const validStatuses = ['접수', '제조중', '완료', '취소'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    // 주문 상태 업데이트
    const result = await client.query(
      `UPDATE orders
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, order_number, status, updated_at`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    // 상태가 '완료'로 변경되는 경우, 주문 항목들의 재고를 차감
    if (status === '완료') {
      // 주문 항목 조회
      const itemsResult = await client.query(
        `SELECT menu_id, quantity
         FROM order_items
         WHERE order_id = $1`,
        [orderId]
      );

      // 각 주문 항목의 재고 차감
      for (const item of itemsResult.rows) {
        // 재고 확인
        const stockResult = await client.query(
          'SELECT stock_quantity FROM menus WHERE id = $1',
          [item.menu_id]
        );

        if (stockResult.rows.length === 0) {
          throw new Error(`Menu not found: ${item.menu_id}`);
        }

        const currentStock = parseInt(stockResult.rows[0].stock_quantity);
        
        // 재고가 부족한 경우 오류 발생 (제조 완료는 재고가 있어야 가능)
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for menu ${item.menu_id}. Available: ${currentStock}, Required: ${item.quantity}`);
        }

        // 재고 차감
        await client.query(
          'UPDATE menus SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, item.menu_id]
        );
      }

      console.log(`✅ Stock deducted for order ${orderId} (${itemsResult.rows.length} items)`);
    }

    await client.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in updateOrderStatus:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 주문 통계 조회
 */
const getOrderStats = async () => {
  try {
    const result = await query(
      `SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = '접수' THEN 1 END) as received_orders,
        COUNT(CASE WHEN status = '제조중' THEN 1 END) as in_production_orders,
        COUNT(CASE WHEN status = '완료' THEN 1 END) as completed_orders
       FROM orders`
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in getOrderStats:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
};

