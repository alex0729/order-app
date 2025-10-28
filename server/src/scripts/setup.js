const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up database...');
    
    // 데이터베이스 생성 (PostgreSQL에 직접 실행)
    console.log('📝 To create the database, please run this command in PostgreSQL:');
    console.log('');
    console.log('CREATE DATABASE coffee_order_db;');
    console.log('');
    console.log('Or run:');
    console.log('psql -U postgres -c "CREATE DATABASE coffee_order_db"');
    console.log('');

    // 테이블 생성 및 샘플 데이터 삽입은 서버 시작 시 자동으로 실행됩니다
    console.log('✅ Run "npm run dev" to start the server and initialize tables');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;

