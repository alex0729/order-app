const { Pool } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
  // 먼저 postgres 데이터베이스에 연결
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres', // 기본 postgres 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    console.log('🔗 Connecting to PostgreSQL...');
    
    // 데이터베이스 존재 여부 확인
    const checkDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'coffee_order_db'"
    );

    if (checkDb.rows.length === 0) {
      console.log('📝 Creating database coffee_order_db...');
      await adminPool.query('CREATE DATABASE coffee_order_db');
      console.log('✅ Database created successfully');
    } else {
      console.log('ℹ️ Database coffee_order_db already exists');
    }

    await adminPool.end();
    console.log('🎉 Database setup complete');
  } catch (error) {
    console.error('❌ Error creating database:', error);
    await adminPool.end();
    throw error;
  }
};

if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
