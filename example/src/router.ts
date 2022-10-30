import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: () => import('./Home.vue') },
    { path: '/gif-parser', component: () => import('./packages/gif-parser/Index.vue') },
    { path: '/gif-player', component: () => import('./packages/gif-player/Index.vue') },
    { path: '/gif-player-vue-next', component: () => import('./packages/gif-player-vue-next/Index.vue') },
];

export default createRouter({
    history: createWebHistory(),
    routes
});
