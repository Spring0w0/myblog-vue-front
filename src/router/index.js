import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/ArchiveView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/home/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetailView.vue')
  },
  {
    path: '/home/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 路由守卫
 * 权限控制逻辑：
 * 1. 访问 /home/admin 且无 admin_token，强制重定向至 /login
 * 2. 已登录状态下访问 /login，重定向至 /home/admin
 * 3. 其他页面正常访问
 */
router.beforeEach((to, from, next) => {
  // 从 localStorage 获取登录状态
  const isAuthenticated = localStorage.getItem('admin_token') === 'authenticated'
  
  // 需要登录才能访问的页面
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      next('/login')
      return
    }
  }
  
  // 仅限未登录用户访问的页面（如登录页）
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      // 已登录，重定向到管理页
      next('/home/admin')
      return
    }
  }
  
  // 其他情况正常放行
  next()
})

export default router
