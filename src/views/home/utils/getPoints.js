import axios from 'axios';

/**
 * 获取用户积分信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 包含积分数据或错误信息的Promise对象
 */
export async function getPoints(userId) {
  try {
    const response = await axios.get('/api/getPoints', {
      params: { userId: userId },
    });
    
    if (response.data.code === 20000) {
      return response.data;
    } else {
      console.error('积分请求失败', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('积分请求失败', error);
    return null;
  }
}
