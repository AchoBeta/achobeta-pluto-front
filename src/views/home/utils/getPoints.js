import axios from 'axios';

/**
 * 获取用户积分信息
 * @param {string} atoken - 用户的访问令牌
 * @returns {Promise<Object>} 包含积分数据或错误信息的Promise对象
 */
export async function getPoints(atoken) {
  try {
    const response = await axios.get('/api/getPoints', {
      params: { atoken: atoken },
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
