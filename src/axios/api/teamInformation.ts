import apiClient from '@/axios/axios'
import axios from 'axios';

//const atoken = localStorage.getItem('atoken');
//获取权限组 团队信息
export function getPowerApi(params: { team_id: number; }) {
    return apiClient.get('/api/team/power',  {
        params:params
    } );
}

//删除团队成员
export function deleteTeamMemberApi(team_id: number,member_id: any) {
    return apiClient.delete(`/api/team/memberlist/delete/${team_id}/${member_id}`);
}
// export function deleteTeamMemberApi(url) {
//     return apiClient.delete(url);
// }
//新建团队
export function CreateTeamApi(team_name: string) {
    return apiClient.post('/api/team/structure/create',  {
        team_name:team_name
    } );
}

//查询指定团队成员信息
export function getTeamMemberListApi(params: { team_id: number; page: number; perpage: number; }) {
    return apiClient.get('/api/team/memberlist/get', { params });
}

////团队架构管理

//获取指定团队全部架构
export function getTeamStructureApi(params: { team_id: number; }) {
    return apiClient.get('/api/team/structure/collection',  {
        params:params
    } );
}

//保存团队架构
export function putTeamNodeApi(data: { team_id: number; team_structures: never[]; }) {
    return apiClient.put('/api/team/structure/change', data);
}



