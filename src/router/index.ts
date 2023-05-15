import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

import Teacher_Home from '../views/teacher/teacher_home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/admin',
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
                path: '/admin-class-manger',
                name: 'admin-class-manger',
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
            {
                path: '/admin-course-manger',
                name: 'admin-course-manger',
                meta: {
                    title: '课程管理(管理员)',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/course-manger.vue'),
            },
            {
                path: '/course-manger',
                name: 'course-manger',
                meta: {
                    title: '课程管理',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/course-manger.vue'),
            },
            {
                path: '/exam-info-release',
                name: 'exam-info-release',
                meta: {
                    title: '考试信息发布',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/teacher/exam/exam-info-release.vue'),
            },
            {
                path: '/exam-result-release',
                name: 'exam-result-release',
                meta: {
                    title: '考试结果发布',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/teacher/exam/exam-result-release.vue'),
            },
            {
                path: '/edu-notice',
                name: 'edu-notice',
                meta: {
                    title: '教务公告',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/edu-notice.vue'),
            },
            {
                path: '/reg-key',
                name: 'reg-key',
                meta: {
                    title: '教师注册Key',
                },
                component: () => import(/* webpackChunkName: "login" */ '../views/reg-key.vue'),
            },
        ],
    },
    {
        path: '/teacher',
        name: 'Teacher_Home',
        component: Teacher_Home,
        children: [
            {
                path: '/teacher/class-manger',
                name: 'class-manger',
                meta: {
                    title: '我的班级',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/teacher/class-manger.vue'),
            },
            // {
            //     path: '/teacher/course-manger',
            //     name: 'course-manger',
            //     meta: {
            //         title: '我的学科',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "dashboard" */ '../views/teacher/course-manger.vue'),
            // },
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
        path: '/register',
        name: 'Register',
        meta: {
            title: '注册',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/register.vue'),
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
