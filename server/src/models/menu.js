const { query } = require('../config/database');

/**
 * 모든 메뉴 조회 (옵션 포함)
 */
const getAllMenus = async () => {
  try {
    // 메뉴 조회
    const menusResult = await query(
      `SELECT id, name, description, price, image_url, stock_quantity, category, is_available, created_at, updated_at
       FROM menus
       WHERE is_available = true
       ORDER BY category, id`
    );

    // 각 메뉴의 옵션 조회
    const menus = await Promise.all(
      menusResult.rows.map(async (menu) => {
        const optionsResult = await query(
          `SELECT id, name, price_modifier, option_type, is_required
           FROM options
           WHERE menu_id = $1
           ORDER BY option_type, id`,
          [menu.id]
        );

        return {
          ...menu,
          options: optionsResult.rows
        };
      })
    );

    return menus;
  } catch (error) {
    console.error('Error in getAllMenus:', error);
    throw error;
  }
};

/**
 * 특정 메뉴 조회 (옵션 포함)
 */
const getMenuById = async (id) => {
  try {
    const menuResult = await query(
      `SELECT id, name, description, price, image_url, stock_quantity, category, is_available, created_at, updated_at
       FROM menus
       WHERE id = $1`,
      [id]
    );

    if (menuResult.rows.length === 0) {
      return null;
    }

    const menu = menuResult.rows[0];

    // 옵션 조회
    const optionsResult = await query(
      `SELECT id, name, price_modifier, option_type, is_required
       FROM options
       WHERE menu_id = $1
       ORDER BY option_type, id`,
      [id]
    );

    return {
      ...menu,
      options: optionsResult.rows
    };
  } catch (error) {
    console.error('Error in getMenuById:', error);
    throw error;
  }
};

/**
 * 재고 현황 조회 (관리자용)
 */
const getStockStatus = async () => {
  try {
    const result = await query(
      `SELECT id, name, stock_quantity, category, is_available
       FROM menus
       ORDER BY category, name`
    );

    return result.rows;
  } catch (error) {
    console.error('Error in getStockStatus:', error);
    throw error;
  }
};

/**
 * 메뉴 재고 수량 수정
 */
const updateStock = async (menuId, stockQuantity) => {
  try {
    const result = await query(
      `UPDATE menus
       SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, stock_quantity`,
      [stockQuantity, menuId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error in updateStock:', error);
    throw error;
  }
};

/**
 * 재고 차감 (주문 시)
 */
const decreaseStock = async (menuId, quantity) => {
  try {
    const result = await query(
      `UPDATE menus
       SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND stock_quantity >= $1
       RETURNING id, name, stock_quantity`,
      [quantity, menuId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error in decreaseStock:', error);
    throw error;
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  getStockStatus,
  updateStock,
  decreaseStock
};

