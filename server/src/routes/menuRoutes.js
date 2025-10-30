const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menus - 메뉴 목록 조회
router.get('/', menuController.getAllMenus);

// GET /api/menus/stock - 재고 현황 조회 (관리자용) - /:id보다 먼저 배치 필요
router.get('/stock', menuController.getStockStatus);

// PUT /api/menus/:id/stock - 재고 수정 (관리자용)
router.put('/:id/stock', menuController.updateStock);

// GET /api/menus/:id - 특정 메뉴 조회 (마지막에 배치)
router.get('/:id', menuController.getMenuById);

module.exports = router;

