import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    // 用户中心
    {
        path: '/',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../pages/indexPage.vue')
    },
    // 聊天大厅
    {
        path: '/chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "about" */ '../pages/chatPage.vue')
    },
    // 博客社区
    {
        path: '/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "about" */ '../pages/blogPage.vue')
    },
    // 博客搜索页
    {
        path: '/blog/search',
        name: 'blogSearch',
        component: () => import(/* webpackChunkName: "about" */ '../components/blogComponents/blogSearchPage.vue')
    },
    // 博客阅读页
    {
        path: '/blog/read',
        name: 'blogRead',
        component: () => import(/* webpackChunkName: "about" */ '../components/blogComponents/blogReadPage.vue')
    },
    // 博客阅读页
    {
        path: '/blog/read/:id',
        name: 'blogRead1',
        component: () => import(/* webpackChunkName: "about" */ '../components/blogComponents/blogReadPage.vue')
    },
    // 用户列表页
    {
        path: '/user/list',
        name: 'userList',
        component: () => import(/* webpackChunkName: "about" */ '../components/userComponents/userListPage.vue')
    },
    // 队伍列表页
    {
        path: '/team/list',
        name: 'teamList',
        component: () => import(/* webpackChunkName: "about" */ '../components/teamComponents/teamListPage.vue')
    },
    // 用户注册页
    {
        path: '/user/register',
        name: 'userRegister',
        component: () => import(/* webpackChunkName: "about" */ '../components/userComponents/userRegisterPage.vue')
    },
    // 用户登录页
    {
        path: '/user/login',
        name: 'userLogin',
        component: () => import(/* webpackChunkName: "about" */ '../components/userComponents/userLoginPage.vue')
    },
    // 个人信息页
    {
        path: '/user/info',
        name: 'userInfo',
        component: () => import(/* webpackChunkName: "about" */ '../components/userComponents/userInfoPage.vue')
    },
    // 队伍信息页
    {
        path: '/team/info',
        name: 'teamInfo',
        component: () => import(/* webpackChunkName: "about" */ '../components/teamComponents/teamInfoPage.vue')
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;
