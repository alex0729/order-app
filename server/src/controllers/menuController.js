const menuModel = require('../models/menu');

/**
 * 모든 메뉴 조회
 */
const getAllMenus = async (req, res) => {
  try {
    const menus = await menuModel.getAllMenus();
    
    res.status(200).json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Error in getAllMenus controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '메뉴 목록을 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 특정 메뉴 조회
 */
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await menuModel.getMenuById(parseInt(id));

    if (!menu) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MENU_NOT_FOUND',
          message: '메뉴를 찾을 수 없습니다.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Error in getMenuById controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '메뉴를 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 재고 현황 조회 (관리자용)
 */
const getStockStatus = async (req, res) => {
  try {
    const stockStatus = await menuModel.getStockStatus();
    
    res.status(200).json({
      success: true,
      data: stockStatus
    });
  } catch (error) {
    console.error('Error in getStockStatus controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '재고 현황을 조회하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

/**
 * 메뉴 재고 수정 (관리자용)
 */
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    // 입력 검증
    if (stock_quantity === undefined || stock_quantity === null) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '재고 수량이 필요합니다.',
          details: 'stock_quantity 필드가 필요합니다.'
        }
      });
    }

    if (typeof stock_quantity !== 'number' || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '유효하지 않은 재고 수량입니다.',
          details: 'stock_quantity는 0 이상의 숫자여야 합니다.'
        }
      });
    }

    const updatedMenu = await menuModel.updateStock(parseInt(id), stock_quantity);

    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MENU_NOT_FOUND',
          message: '메뉴를 찾을 수 없습니다.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: updatedMenu
    });
  } catch (error) {
    console.error('Error in updateStock controller:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '재고를 수정하는 중 오류가 발생했습니다.',
        details: error.message
      }
    });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  getStockStatus,
  updateStock
};

