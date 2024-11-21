import apiClient from '@/utils/axios'
//获取权限组 团队信息
export function getPowerApi(params) {
    return apiClient.get('https://api.example.com/data', { params });
}