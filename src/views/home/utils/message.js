import axios from 'axios';


// 基于 axios 创建实例的工厂函数，用于动态设置超时时间
const createAxiosInstance = (timeout) => {
  return axios.create({
    timeout, // 动态设置超时时间
  });
};

// 错误处理函数
const handleApiError = (data) => {
  if (!data || typeof data !== 'object' || !data.code) {
    console.error('Invalid data received in handleApiError:', data);
    ElMessage.error('发生未知错误');
    return;
  }

  if (data.code === 60004) {
    console.error('数据库错误:', data.message);
    ElMessage.error('后台出现错误，请稍后重试');
  } else if (data.code === -20000 || data.code === -20002) {
    console.error('Token 错误:', data.message);
    ElMessage.error('登录信息已过期或无效，请重新登录');
    // window.location.href = '/login'; // 强制跳转到登录页面
  } else if (data.code === -20003) {
    console.error('Token 类型错误:', data.message);
    ElMessage.error('程序出错，请联系开发人员');
  } else {
    console.error('未知错误:', data.message);
    ElMessage.error(data.message || '请求失败，请稍后重试');
  }
};
// 获取消息
export const getMessages = async (atoken, page, timestamp=0) => {
  const axiosInstance = createAxiosInstance(500); // 设置超时时间
  
  try {
    const response = await axiosInstance.get('/api/message/get', {
      params: { page, timestamp },// Query 参数
      headers: { Authorization: `${atoken}` }, // 将 atoken 放在请求头
    });
    const data = response.data;

      if (!data) {
      console.error('未收到服务器响应');
      ElMessage.error('没有收到服务器响应');
      return { code: -1, message: '没有收到服务器响应' };
    }

    if (response.data.code === 20000) {
      return response.data;
    } else {
      handleApiError(response.data);
      return { code: response.data.code, data: { messages: [], total_pages: 0 } }; // 提供默认值
    }
  }catch (error) {
    console.error('请求失败:', error);
    handleApiError({ code: -1, message: '请求失败' });
    return { code: -1, data: { messages: [], total_pages: 0 } }; // 返回默认值以避免报错
  }
};

// 标记单条消息为已读
export const markMessageAsRead = async (userMessageId) => {
  console.log('标记为已读的 userMessageId:', userMessageId); // 打印传入的 userMessageId
  
  const axiosInstance = createAxiosInstance(2000); // 设置默认超时时间
  try {
    const response = await axiosInstance.post(
      '/api/message/markread',
      { user_message_id: userMessageId },
      {
        headers: {
          'Content-Type': 'application/json', // 明确设置为 JSON 格式
        },
      }
    );    

    console.log(response.data)
    if (response.data.code === 20000) {
      return response.data;
    } else {
      console.error('标记消息为已读失败:', response.data.message || '未知错误');
      throw new Error(response.data.message || '标记失败');
    }
  } catch (error) {
    if (error.response) {
      // 请求已发送且后端返回错误状态码
      console.error('服务器返回错误:', error.response.data.message || '未知错误');
      throw new Error(error.response.data.message || '请求失败');
    } else if (error.code === 'ECONNABORTED') {
      // 请求超时
      console.error('请求超时: 标记消息为已读接口未响应');
      throw new Error('请求超时，请稍后重试');
    } else {
      // 其他错误
      console.error('请求失败:', error.message || '未知错误');
      throw new Error(error.message || '请求失败');
    }
  }
};

// 标记多条消息为已读
export const markMessagesAsRead = async () => {
  const atoken = localStorage.getItem('atoken'); // 从本地存储获取 atoken
  if (!atoken) {
    throw new Error('登录信息缺失，请重新登录');
  }

  const axiosInstance = axios.create({
    timeout: 2000, // 设置超时时间
    headers: {
      Authorization: `${atoken}`, // 将 atoken 放入请求头
    },
  });

  try {
    const response = await axiosInstance.post('/api/message/markread-all', {
    });

    console.log('全部已读',response)
    if (response.data && response.data.code === 20000) {
      return response.data;
    } else {
      console.error('标记消息为已读失败:', response.data.message || '未知错误');
      throw new Error(response.data?.message || '标记失败');
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('请求超时: 标记多条消息为已读接口超时未响应');
      throw new Error('请求超时，请稍后重试');
    } else {
      console.error('标记多条消息为已读失败:', error);
      throw new Error(error.message || '请求失败');
    }
  }
};
