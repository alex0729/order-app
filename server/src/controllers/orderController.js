const orderModel = require('../models/order');

/**
 * 주문 생성
 */
const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_phone, special_requests, items } = req.body;

    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '주문 항목이 필요합니다.',
          details: 'items 배열에 최소 1개 이상의 항목이 필요합니다.'
        }
      });
    }

    // 각 항목 검증
    for (const item of items) {
      if (!item.menu_id || !item.quantity) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '주문 항목 정보가 올바르지 않습니다.',
            details: '각 항목에는 menu_id와 quantity가 필요합니다.'
          }
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '수량은 1개 이상이어야 합니다.'
          }
        });
      }
    }

    const orderData = {
      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      special_requests: special_requests || null,
      items: items,
      status: '접수'
    };

    const order = await orderModel.createOrder(orderData);

    res.status(201).json({
      success: true,
      data: {
        order_id: order.id,
        order_number: order.order_number,
        total_amount: parseFloat(order.total_amount),
        status: order.status,
        created_at: order.created_at
      }
    });
  } catch (error) {
    console.error('Error in createOrder controller:', error);
    
    // 재고 부족 오류 처리
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: '재고가 부족합니다.',
          details: error.message
        }
      });
    }

    // 메뉴를 찾을 수 없는 경우
    if (error.message.includes('Menu not found')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MENU_NOT_FOUND',
          message: '메뉴를 찾을 수 없습니다.',
          details: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '주문을 생성하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 주문 목록 조회
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (limit) {
      filters.limit = parseInt(limit);
    }
    if (page && limit) {
      filters.offset = (parseInt(page) - 1) * parseInt(limit);
    }

    const orders = await orderModel.getAllOrders(filters);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error in getAllOrders controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '주문 목록을 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 특정 주문 조회
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: '주문을 찾을 수 없습니다.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error in getOrderById controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '주문을 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 주문 상태 변경
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 입력 검증
    if (!status) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '주문 상태가 필요합니다.',
          details: 'status 필드가 필요합니다.'
        }
      });
    }

    const validStatuses = ['접수', '제조중', '완료', '취소'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: '유효하지 않은 주문 상태입니다.',
          details: `허용된 상태: ${validStatuses.join(', ')}`
        }
      });
    }

    const updatedOrder = await orderModel.updateOrderStatus(parseInt(id), status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: '주문을 찾을 수 없습니다.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error in updateOrderStatus controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '주문 상태를 변경하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 주문 통계 조회
 */
const getOrderStats = async (req, res) => {
  try {
    const stats = await orderModel.getOrderStats();
    
    res.status(200).json({
      success: true,
      data: {
        total_orders: parseInt(stats.total_orders),
        received_orders: parseInt(stats.received_orders),
        in_production_orders: parseInt(stats.in_production_orders),
        completed_orders: parseInt(stats.completed_orders)
      }
    });
  } catch (error) {
    console.error('Error in getOrderStats controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '주문 통계를 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
};

