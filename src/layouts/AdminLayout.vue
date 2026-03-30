<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const navLinks = [
  {
    name: '仪表盘',
    path: '/admin/dashboard',
    icon: '📊'
  },
  {
    name: '文章管理',
    path: '/admin/articles',
    icon: '📝'
  },
  {
    name: '分类管理',
    path: '/admin/categories',
    icon: '📁'
  },
  {
    name: '标签管理',
    path: '/admin/tags',
    icon: '🏷️'
  },
  {
    name: '网站配置',
    path: '/admin/settings',
    icon: '⚙️'
  }
]

const handleLogout = () => {
  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
  router.push('/login')
}

</script>

<template>
  <div class="admin-layout-container min-h-screen flex">
    <!-- 左侧导航栏 -->
    <aside 
      :class="[`bg-[#304156] text-white h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300`, 
              sidebarCollapsed ? 'w-16' : 'w-[220px]']"
    >
      <div class="p-4 border-b border-gray-700 flex items-center justify-between">
        <div v-if="!sidebarCollapsed" class="flex flex-col">
          <h1 class="text-xl font-bold">MizukiBlog</h1>
          <p class="text-xs text-gray-400">管理后台</p>
        </div>
        <div v-else class="text-white">
          <span class="text-xl">M</span>
        </div>
      </div>
      <nav class="mt-4">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          :class="[`flex items-center px-4 py-3 transition-colors`, 
                  route.path === link.path ? 'bg-[#409EFF] text-white' : 'text-gray-300 hover:bg-[#409EFF]']"
        >
          <span class="mr-3">{{ link.icon }}</span>
          <span v-if="!sidebarCollapsed">{{ link.name }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div :class="[`flex-1 min-h-screen transition-all duration-300`, 
                sidebarCollapsed ? 'ml-16' : 'ml-[220px]']">
      <!-- 顶部工具栏 -->
      <header class="bg-white shadow-sm h-16 flex items-center px-6">
        <button 
          @click="toggleSidebar"
          class="mr-4 text-gray-600 hover:text-[#409EFF] transition-colors text-xl font-bold"
        >
          <span v-if="!sidebarCollapsed">&lt;&lt;</span>
          <span v-else>&gt;&gt;</span>
        </button>
        <div class="ml-auto flex items-center gap-4">
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="bg-[#f0f2f5] min-h-[calc(100vh-4rem)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout-container {
  font-family: 'Segoe UI', Roboto, sans-serif;
}

/* 确保内容区有足够的内边距 */
main {
  padding: 20px;
}
</style>