const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { query, pool } = require('./config/database');
const initDb = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
// 메뉴 관련 라우트
app.get('/api/menus', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: '메뉴 목록 조회 (구현 필요)'
  });
});

// 주문 관련 라우트
app.post('/api/orders', (req, res) => {
  res.status(200).json({
    success: true,
    message: '주문 생성 (구현 필요)'
  });
});

app.get('/api/orders', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: '주문 목록 조회 (구현 필요)'
  });
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || '서버 오류가 발생했습니다.'
    }
  });
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.'
    }
  });
});

// Server start
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initDb();

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  pool.end(() => {
    console.log('✅ Database connections closed');
    process.exit(0);
  });
});

startServer();

