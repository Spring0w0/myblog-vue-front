<template>
  <nav id="navbar" class="z-50 w-full bg-[var(--card-bg)] border-b border-[var(--line-divider)] transition-all duration-300">
    <div class="max-w-[90rem] h-18 mx-auto flex items-center justify-between px-4">
      <!-- Logo/标题 -->
      <router-link to="/" class="btn-plain scale-animation rounded-lg h-10 md:h-13 px-5 font-bold active:scale-95 shrink-0 transition-all duration-300">
        <div class="flex flex-row items-center text-md">
          <img 
            src="/assets/home/default-logo.png" 
            alt="Mizuki" 
            class="h-10 md:h-13 max-w-full object-contain transition-all duration-300" 
            loading="lazy" 
          />
        </div>
      </router-link>
      
      <!-- 导航链接 - 桌面端 -->
      <div id="navbar-links-container" class="hidden md:flex items-center space-x-1 transition-opacity duration-300">
        <router-link 
          v-for="link in navLinks" 
          :key="link.name"
          :to="link.url"
          class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] active:scale-90 transition-all"
        >
          <span class="flex items-center gap-2">
            <svg v-if="link.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
              <path :d="link.iconPath" />
            </svg>
            {{ link.name }}
          </span>
        </router-link>
        
        <!-- 下拉菜单 - Links -->
        <div class="relative group">
          <button class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] active:scale-90 transition-all flex items-center gap-2">
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Links
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" class="transition-transform group-hover:rotate-180">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          <div class="absolute top-full left-0 mt-1 w-48 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--line-divider)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <a 
              v-for="child in dropdownLinks" 
              :key="child.name"
              :href="child.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-hover)] first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              <svg v-if="child.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                <path :d="child.iconPath" />
              </svg>
              {{ child.name }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- 右侧功能按钮 -->
      <div class="flex items-center gap-1">
        <!-- 搜索按钮 -->
        <button aria-label="Search" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all">
          <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        
        <!-- 主题切换按钮 -->
        <button 
          aria-label="Toggle Dark Mode" 
          class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
          <svg v-else width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2c-1.05 0-2.05.16-3 .46 1.69 1.24 2.79 3.24 2.79 5.54 0 3.87-3.13 7-7 7-1.1 0-2.14-.26-3.07-.72C.97 18.5 4.49 22 9 22c5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
          </svg>
        </button>
        
        <!-- 移动端菜单按钮 -->
        <button 
          aria-label="Menu" 
          class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 md:hidden text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all"
          @click="toggleMobileMenu"
        >
          <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 移动端菜单面板 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-[var(--card-bg)] border-t border-[var(--line-divider)]">
        <div class="px-4 py-2">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name"
            :to="link.url"
            class="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-hover)] rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            <svg v-if="link.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
              <path :d="link.iconPath" />
            </svg>
            {{ link.name }}
          </router-link>
          <div class="border-t border-[var(--line-divider)] my-2"></div>
          <div class="px-4 py-2 text-xs text-[var(--text-tertiary)] font-medium">Links</div>
          <a 
            v-for="child in dropdownLinks" 
            :key="child.name"
            :href="child.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-hover)] rounded-lg transition-colors"
          >
            <svg v-if="child.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
              <path :d="child.iconPath" />
            </svg>
            {{ child.name }}
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 导航链接配置
const navLinks = ref([
  {
    name: '首页',
    url: '/',
    icon: true,
    iconPath: 'M12 3L4 9v12h16V9L12 3zm0 2.18l6 4.5v8.32H6V9.68l6-4.5z'
  },
  {
    name: '归档',
    url: '/archive',
    icon: true,
    iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'
  }
])

// 下拉菜单链接
const dropdownLinks = ref([
  {
    name: 'GitHub',
    url: 'https://github.com/matsuzaka-yuki/Mizuki',
    icon: true,
    iconPath: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'
  },
  {
    name: 'Bilibili',
    url: 'https://space.bilibili.com/701864046',
    icon: true,
    iconPath: 'M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z'
  },
  {
    name: 'Gitee',
    url: 'https://gitee.com/matsuzakayuki/Mizuki',
    icon: true,
    iconPath: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'
  }
])

// 移动端菜单状态
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 主题切换
const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.btn-plain {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-plain:hover {
  background: var(--card-hover);
}

.scale-animation {
  transition: transform 0.2s ease;
}

.scale-animation:active {
  transform: scale(0.95);
}
</style>