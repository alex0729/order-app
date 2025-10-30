const { query } = require('./database');
const createTables = require('./createTables');

const initDb = async () => {
  try {
    console.log('🚀 Initializing database...');

    // 데이터베이스 존재 여부 확인
    const checkDb = await query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // 테이블 생성
    await createTables();

    // 샘플 데이터 삽입 (선택사항)
    await insertSampleData();

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

const insertSampleData = async () => {
  try {
    // 메뉴가 이미 있는지 확인
    const existingMenus = await query('SELECT COUNT(*) FROM menus');
    
    if (parseInt(existingMenus.rows[0].count) === 0) {
      console.log('📝 Inserting sample data...');

      // 샘플 메뉴 삽입
      const menus = [
        {
          name: '아메리카노',
          description: '진한 에스프레소에 물을 넣어 만든 커피',
          price: 4000,
          image_url: '/images/americano.jpg',
          stock_quantity: 50,
          category: '아메리카노'
        },
        {
          name: '카페라떼',
          description: '부드러운 우유와 에스프레소가 만난 커피',
          price: 5000,
          image_url: '/images/latte.jpg',
          stock_quantity: 40,
          category: '라떼'
        },
        {
          name: '카푸치노',
          description: '에스프레소에 스팀 우유와 우유 거품을 올린 커피',
          price: 5000,
          image_url: '/images/cappuccino.jpg',
          stock_quantity: 35,
          category: '라떼'
        }
      ];

      for (const menu of menus) {
        const menuResult = await query(
          `INSERT INTO menus (name, description, price, image_url, stock_quantity, category) 
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [menu.name, menu.description, menu.price, menu.image_url, menu.stock_quantity, menu.category]
        );
        
        const menuId = menuResult.rows[0].id;

        // 기본 옵션 추가 (샷 추가, 시럽 추가)
        const defaultOptions = [
          {
            name: '샷 추가',
            price_modifier: 500,
            option_type: 'extra_shot',
            is_required: false
          },
          {
            name: '시럽 추가',
            price_modifier: 0,
            option_type: 'syrup',
            is_required: false
          }
        ];

        for (const option of defaultOptions) {
          await query(
            `INSERT INTO options (name, price_modifier, menu_id, option_type, is_required)
             VALUES ($1, $2, $3, $4, $5)`,
            [option.name, option.price_modifier, menuId, option.option_type, option.is_required]
          );
        }
      }

      console.log('✅ Sample data inserted');
    } else {
      console.log('ℹ️ Sample data already exists');
    }
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
};

module.exports = initDb;

