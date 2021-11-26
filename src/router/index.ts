import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router';
import { StateInterface } from '../store';
import multiguard from 'vue-router-multiguard'

export default route<StateInterface>(function ({ store }) {
  const IF_AUTHENTICATED = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) =>
    store.getters['user/auth'] ? next() : next({ name: 'login' });

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: () => import('layouts/main.vue'),
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('pages/index.vue'),
          beforeEnter: multiguard([ IF_AUTHENTICATED ]),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('pages/login.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('pages/signup.vue')
        },
        {
          path: 'invite/:user',
          name: 'invite',
          component: () => import('pages/invite.vue')
        },
        {
          path: 'activate/:user',
          name: 'activate',
          component: () => import('pages/activate.vue')
        }
      ]
    },
    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/error404.vue'),
    }
  ];

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) =>
    store.dispatch('user/init').then(() => next(), () => next()));

  return Router;
});
