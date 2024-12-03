import axios from 'axios';
axios.defaults.baseURL = 'http://117.72.97.101:8085';
export async function exitSystem() {
  const atoken = localStorage.getItem('atoken'); // 从本地获取 atoken

  if (!atoken) {
    return { success: false, message: '未找到有效的 atoken，请重新登录' };
  }

  try {
    const response = await axios.delete('/api/login/exit', { 
      data: { token: atoken },
      //timeout: 500, // 设置超时时间
    });
console.log(response.data);
    if (response.data.code === 20000) {
      return { success: true, message: '退出成功' };
    } else if (response.data.code === -20000) {
      return { success: false, message: '登录已过期，请重新登录' };
    } else if (response.data.code === -20002) {
      return { success: false, message: '无效的登录参数，请重新登录' };
    } else {
      return { success: false, message: '退出失败，请稍后重试' };
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('退出登录接口调用超时');
      return { success: false, message: '请求超时，退出失败，请稍后重试' };
    } else {
      console.error('退出登录接口调用失败:', error);
      return { success: false, message: '网络错误，退出失败，请稍后重试' };
    }
  }
}
