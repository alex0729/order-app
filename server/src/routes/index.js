const express = require('express');
const router = express.Router();

// 각 라우트 모듈을 여기에 import
// const menuRoutes = require('./menu.routes');
// const orderRoutes = require('./order.routes');

// 라우트 등록
// router.use('/menus', menuRoutes);
// router.use('/orders', orderRoutes);

// 임시 라우트
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Router is working',
    endpoints: {
      menus: '/api/menus',
      orders: '/api/orders'
    }
  });
});

module.exports = router;

