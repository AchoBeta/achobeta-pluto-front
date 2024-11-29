import apiClient from '@/axios/axios'

export function reflashRtokenApi(params) {
    return apiClient.post('/api/common/rtoken',  {
        body:params
    } );
}

export function checkAutoLoginApi(params) {
    return apiClient.post('/api/login/auto',  {
        body:params
    } );
}