import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/front/HomeView.vue')
      },
      {
        path: 'home',
        redirect: '/'
      },
      {
        path: 'archive',
        name: 'Archive',
        component: () => import('../views/front/ArchiveView.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/front/AboutView.vue')
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/front/HelpView.vue')
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('../views/front/ArticleDetailView.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('../views/admin/ArticleList.vue')
      },
      {
        path: 'articles/new',
        name: 'ArticleNew',
        component: () => import('../views/admin/ArticleEdit.vue')
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        component: () => import('../views/admin/ArticleEdit.vue')
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('../views/admin/CategoryManage.vue')
      },
      {
        path: 'tags',
        name: 'AdminTags',
        component: () => import('../views/admin/TagManage.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/WebsiteSettings.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/front/LoginView.vue'),
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 从Cookie中获取token
 * @returns {string|null} token
 */
const getTokenFromCookie = () => {
  const cookieValue = document.cookie
    .split('; ') 
    .find(row => row.startsWith('admin_token='))
    ?.split('=')[1];
  return cookieValue || null;
};

/**
 * 路由守卫
 * 权限控制逻辑：
 * 1. 访问 admin 且无 admin_token，强制重定向至 /login
 * 2. 已登录状态下访问 /login，重定向至 /home/admin
 * 3. 其他页面正常访问
 */
router.beforeEach((to, from, next) => {
  // 从 Cookie 获取登录状态
  const token = getTokenFromCookie();
  const isAuthenticated = !!token;
  
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
      next('/admin')
      return
    }
  }
  
  // 其他情况正常放行
  next()
})

export default router
