import axios from 'axios';

// 基于 axios 创建实例的工厂函数，用于动态设置超时时间
const createAxiosInstance = (timeout) => {
  return axios.create({
    timeout, // 动态设置超时时间
  });
};

// 刷新 token
export const refreshToken = async () => {
  const rtoken = localStorage.getItem('rtoken'); // 从 localStorage 获取 rtoken
  if (!rtoken) {
    console.log('refreshToken: rtoken 不存在，无法刷新 token');
    showLogoutMessage('登录信息已过期，请重新登录。');
    redirectToLogin();
    return false; // 如果没有 rtoken，跳转到登录页
  }

  try {
    const response = await axios.post('/api/common/rtoken', { token: rtoken }, {
      headers: { 'Content-Type': 'application/json' },
    });

    // 判断响应是否成功
    if (response.data.code === 20000) {
      const { atoken, rtoken: newRtoken } = response.data.data;
      console.log('刷新 token 成功');

      // 存储新的 token 和 rtoken 到 localStorage
      localStorage.setItem('atoken', atoken);
      localStorage.setItem('rtoken', newRtoken);
      return true; // 刷新成功
    } else if (response.data.code === -20000 || response.data.code === -20002) {
      // 如果 token 已过期或者无效，跳转到登录页面
      console.error('token已过期或无效，强制跳转到登录页');
      showLogoutMessage('登录信息失效，请重新登录。');
      redirectToLogin();
      return false; // 刷新失败
    }
  } catch (error) {
    console.error('刷新 token 请求失败:', error);
    showLogoutMessage('请求失败，请重新登录。');
    redirectToLogin(); // 出现错误也跳转到登录页面
    return false; // 刷新失败
  }
};

// 跳转到登录页
const redirectToLogin = () => {
  localStorage.removeItem('atoken');
  localStorage.removeItem('rtoken');
  window.location.href = '/login'; // 重定向到登录页
};

// 封装的接口请求：先调用 refreshToken，刷新成功后才进行实际请求
export const apiRequest = async (url, method = 'GET', data = null) => {
  const refreshSuccess = await refreshToken(); // 每次请求前先尝试刷新 token
  if (!refreshSuccess) return; // 如果刷新失败，终止请求

  const atoken = localStorage.getItem('atoken'); // 获取最新的 atoken

  const axiosInstance = createAxiosInstance(5000); // 设置超时时间
  try {
    const response = await axiosInstance({
      method,
      url,
      headers: { Authorization: `Bearer ${atoken}` },
      params: method === 'GET' ? data : null, // 如果是 GET 请求，将 data 转为 params
      data: method !== 'GET' ? data : null,  // 如果是 POST 请求，将 data 放在请求体中
    });

    return response.data; // 返回响应数据
  } catch (error) {
    console.error('请求失败:', error);
    throw error; // 继续抛出错误
  }
};
