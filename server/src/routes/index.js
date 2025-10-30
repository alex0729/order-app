const express = require('express');
const router = express.Router();

// 라우트 모듈 import
const menuRoutes = require('./menuRoutes');
const orderRoutes = require('./orderRoutes');

// 라우트 등록
router.use('/menus', menuRoutes);
router.use('/orders', orderRoutes);

// API 정보 라우트
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

