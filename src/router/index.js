// @ts-nocheck
import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/layout/index.vue';
// 静态路由
const constantRoutes = [
    {
        path: '/',
        redirect: '/login', // 根路径重定向到登录页面
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true,
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'home',
                component: () => import('@/views/home/Homepage.vue'),
                name: 'home',
            },
            {
                path: 'team',
                component: () => import('@/views/team/index.vue'),
                name: 'team',
            },
            {
                path: 'team/new-user/:teamId/:teamName',
                component: () => import('@/views/team/components/new-user.vue'),
                name: 'NewUser',
            },
            {
                path: '/team/detail-com/:id',
                component: () => import('@/views/team/components/DetailViewCom.vue'),
                name: 'DetailViewCom',
                props: route => ({
                    id: route.params.id,
                    teamId: route.query.teamId,
                    teamName: route.query.teamName,
                    level: route.query.level
                })
            },
            {
                path: '/team/detail-super/:id',
                component: () => import('@/views/team/components/DetailViewSurper.vue'),
                name: 'DetailViewSurper',
                props: route => ({
                    id: route.params.id,
                    teamId: route.query.teamId,
                    teamName: route.query.teamName,
                    level: route.query.level
                })
            },
            {
                path: 'personal-center', // 新增个人中心路由
                component: () => import('@/views/personal-center/index.vue'),
                name: 'PersonalCenter',
            },
        ],
    },
];
const router = createRouter({
    history: createWebHashHistory(), // 使用浏览器历史模式
    routes: constantRoutes,
});
export default router;
