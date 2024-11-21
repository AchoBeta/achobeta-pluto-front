import axios from 'axios';

export default function useUserData() {
  async function fetchUserData() {
    try {
      const response = await axios.get('/api/GetMemberDetail', {
        params: {
          userid: localStorage.getItem('userid'),
        },
      });
      return response.data;
    } catch (error) {
      console.error('获取用户数据请求失败:', error);
      return null;
    }
  }

  return { fetchUserData };
}
