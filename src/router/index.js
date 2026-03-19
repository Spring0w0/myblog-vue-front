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
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/CategoriesView.vue')
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/TagsView.vue')
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
    component: () => import('../views/AdminView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
