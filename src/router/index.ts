// @ts-nocheck
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue';

// 静态路由
const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
      },
      {
        path: 'hello',
        component: () => import('@/views/hello/index.vue'),
        name: 'hello',
      },
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
        path: 'personal-center', // 新增个人中心路由
        component: () => import('@/views/personal-center/index.vue'),
        name: 'PersonalCenter',
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(), // 使用浏览器历史模式
  routes: constantRoutes,
});

export default router;
