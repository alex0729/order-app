const { query } = require('../config/database');

/**
 * 메뉴 이미지 경로 업데이트
 */
const updateMenuImages = async () => {
  try {
    console.log('🖼️  Updating menu images...');

    // 메뉴 이미지 경로 업데이트
    // 파일명 패턴으로 자동 매칭
    const updates = [
      {
        name: '아메리카노',
        image_url: '/images/americano-hot.jpg'
      },
      {
        name: '카페라떼',
        image_url: '/images/caffe-latte.jpg'
      },
      {
        name: '카푸치노',
        image_url: '/images/caffe-latte.jpg' // 카푸치노 이미지가 없으므로 라떼 이미지 사용
      }
    ];

    for (const update of updates) {
      const result = await query(
        `UPDATE menus 
         SET image_url = $1, updated_at = CURRENT_TIMESTAMP
         WHERE name = $2
         RETURNING id, name, image_url`,
        [update.image_url, update.name]
      );

      if (result.rows.length > 0) {
        console.log(`✅ Updated: ${update.name} -> ${update.image_url}`);
      } else {
        console.log(`⚠️  Menu not found: ${update.name}`);
      }
    }

    console.log('✅ Menu images updated successfully');
  } catch (error) {
    console.error('❌ Error updating menu images:', error);
    throw error;
  }
};

// 직접 실행 시
if (require.main === module) {
  updateMenuImages()
    .then(() => {
      console.log('🎉 Update complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Update failed:', error);
      process.exit(1);
    });
}

module.exports = updateMenuImages;

