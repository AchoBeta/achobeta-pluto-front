import axios from 'axios'

//axios实例
const apiClient = axios.create({
  baseURL: 'http://117.72.97.101:8085',
  timeout: 30000, // 请求超时时间为10秒
  headers: { 'Content-Type': 'application/json' }, 
});

export default apiClient;