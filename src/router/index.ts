import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    // 首页
    {
        path: '/',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../pages/indexPage.vue')
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "about" */ '../pages/chatPage.vue')
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "about" */ '../pages/blogPage.vue')
    },
    {
        path: '/blog/search',
        name: 'blogSearch',
        component: () => import(/* webpackChunkName: "about" */ '../components/blogSearchPage.vue')
    },
    // 用户列表页
    {
        path: '/user/list',
        name: 'userList',
        component: () => import(/* webpackChunkName: "about" */ '../components/userListPage.vue')
    },
    // 队伍列表页
    {
        path: '/team/list',
        name: 'teamList',
        component: () => import(/* webpackChunkName: "about" */ '../components/teamListPage.vue')
    },
    // 用户注册页
    {
        path: '/user/register',
        name: 'userRegister',
        component: () => import(/* webpackChunkName: "about" */ '../components/userRegisterPage.vue')
    },
    // 用户登录页
    {
        path: '/user/login',
        name: 'userLogin',
        component: () => import(/* webpackChunkName: "about" */ '../components/userLoginPage.vue')
    },
    // 个人信息页
    {
        path: '/user/info',
        name: 'userInfo',
        component: () => import(/* webpackChunkName: "about" */ '../components/userInfoPage.vue')
    },
    // 队伍信息页
    {
        path: '/team/info',
        name: 'teamInfo',
        component: () => import(/* webpackChunkName: "about" */ '../components/teamInfoPage.vue')
    },

    // 聊天页面
    {
        path: '/chat/message',
        name: 'chatMessage',
        component: () => import(/* webpackChunkName: "about" */ '../components/chatPage.vue')
    },


];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;
