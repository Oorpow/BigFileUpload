import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/admin',
    component: () => import('@/components/Layout/Layout.vue'),
    // redirect: '/admin/home',
    children: [
      // {
      //   path: 'home',
      //   name: 'home',
      //   component: () => import('@/views/Home.vue'),
      // },
      // {
      //   path: 'about',
      //   name: 'about',
      //   component: () => import('@/views/About.vue')
      // }
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关注'
    },
    children: [
      {
        path: 'play',
        name: 'play',
        meta: {
          title: '播放'
        },
        component: () => import('@/views/Play.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 初始化动态路由
export const transformRouter = (authList: any) => {
  const store = useUserStore()

  // 添加动态路由到路由表中
  authList.forEach((route: any) => {
    router.addRoute({
      path: route.path,
      name: route.name,
      component: () => import(`../views/${route.component}.vue`),
    })
  })

  store.setRouterList(router.getRoutes() as any)
}

router.beforeEach((to, from, next) => {
  next()
})

export default router
