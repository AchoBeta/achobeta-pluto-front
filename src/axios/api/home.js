import apiClient from '@/axios/axios';
import axios from 'axios';
////下拉菜单
// 获取用户真实姓名
export function fetchNameApi() {
    return apiClient.get('/api/user-profile/details', {});
}
////常用设备
//分页+设备信息
export function getDevicesApi(data) {
    return axios.get('/api/devices/show', {
        params: data,
        headers: {
            'Authorization': `${localStorage.getItem('atoken')}`,
            'Content-Type': 'application/json'
        }
    });
}
//下线
export function removeDeviceApi(params) {
    return apiClient.delete('/api/devices/remove', {
        data: params
    });
}
////项目进度
export function getProgressApi(params) {
    return apiClient.get('/api/feishu/get', { params: params });
}
////更新atoken
//token
export function reflashAtokenApi(data) {
    return apiClient.put('https://api.example.com/data', data);
}
export function identifyTokenApi(params) {
    return apiClient.get('https://api.example.com/data', { params });
}
export function reflashRtoken(data) {
    return apiClient.put('https://api.example.com/data', data);
}
//免登录
export function checkAutoLoginApi(params) {
    return apiClient.get('https://api.example.com/data', { params });
}
