import apiClient from '@/axios/axios'
import axios from 'axios';

export function reflashRtokenApi(params: string | null) {
    return apiClient.post('/api/common/rtoken',  {
        body:{token:params}
    } );
}

export function checkAutoLoginApi(params: string | null) {
    return apiClient.post('/api/login/auto',  {
        body:{token:params}
    } );
}