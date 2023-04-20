import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/std-manger',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/std-manger',
                name: 'std-manger',
                meta: {
                    title: '学生管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/std-manger.vue'),
            },
            {
                path: '/teacher-manger',
                name: 'teacher-manger',
                meta: {
                    title: '教师管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/teacher-manger.vue'),
            },
            {
                path: '/class-manger',
                name: 'class-manger',
                meta: {
                    title: '班级管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/class-manger.vue'),
            },
            {
                path: '/dept-manger',
                name: 'dept-manger',
                meta: {
                    title: '院系管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dept-manger.vue'),
            },
            {
                path: '/garde-manger',
                name: 'garde-manger',
                meta: {
                    title: '年级管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/garde-manger.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
