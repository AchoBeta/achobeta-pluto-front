import apiClient from '@/axios/axios'
import axios from 'axios';
export function reflashRtokenApi(params) {
    return apiClient.post('/api/common/rtoken', {
        body:{token:params}
    });
}
export function checkAutoLoginApi(params) {
    return apiClient.post('/api/login/auto',  {
        body:{token:params}
    } );
}
