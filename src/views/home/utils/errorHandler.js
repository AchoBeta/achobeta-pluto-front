export const handleApiError = (data) => {
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
  