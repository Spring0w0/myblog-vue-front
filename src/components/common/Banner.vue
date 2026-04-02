<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../../api/client.js'

const router = useRouter()

const currentIndex = ref(0)
const interval = ref(null)
const navbarRef = ref(null)

const desktopBanners = [
  '/assets/desktop-banner/1.webp',
  '/assets/desktop-banner/2.webp',
  '/assets/desktop-banner/3.webp',
  '/assets/desktop-banner/4.webp',
  '/assets/desktop-banner/5.webp',
  '/assets/desktop-banner/6.webp'
]

const defaultTypewriterTexts = [
  '特別なことはないけど、君がいると十分です',
  '今でもあなたは私の光',
  '君ってさ、知らないうちに私の毎日になってたよ',
  '君と話すと、なんか毎日がちょっと楽しくなるんだ',
  '今日はなんでもない日。でも、ちょっとだけいい日'
]

const typewriterTexts = ref([...defaultTypewriterTexts])

const currentText = ref(typewriterTexts.value[0])
const textIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)
const typeSpeed = 100
const deleteSpeed = 50
const pauseTime = 2000

const loadQuotes = async () => {
  try {
    const response = await apiClient.get('/setting')
    if (response && response.success && Array.isArray(response.data)) {
      const quotesConfig = response.data.find(item => item.configKey === 'home_quotes')
      if (quotesConfig && Array.isArray(quotesConfig.configValue) && quotesConfig.configValue.length > 0) {
        typewriterTexts.value = quotesConfig.configValue
        currentText.value = typewriterTexts.value[0]
      }
    }
  } catch (error) {
    console.error('加载轮播语录失败:', error)
  }
}

// 导航链接配置
const navLinks = ref([
  { name: '首页', url: '/', icon: true, iconPath: 'M12 3L4 9v12h16V9L12 3zm0 2.18l6 4.5v8.32H6V9.68l6-4.5z' },
  { name: '归档', url: '/archive', icon: true, iconPath: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z' }
])

// 链接下拉菜单
const linkDropdownLinks = ref([
  { name: 'GitHub', url: 'https://github.com/Spring0w0', icon: true, iconPath: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
  { name: 'Bilibili', url: 'https://space.bilibili.com/335141145', icon: true, iconPath: 'M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z' },
  { name: 'Gitee', url: 'https://gitee.com/springOwO', icon: true, iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.94 15.82c-1.29 0-2.53-.38-3.6-1.07-.37-.22-.68-.52-.91-.88.41.67.94 1.26 1.56 1.73 1.11.89 2.44 1.4 3.85 1.4 1.92 0 3.67-.69 4.98-1.85.37-.32.64-.71.81-1.14-.28.18-.58.33-.9.44-1.38.53-2.93.82-4.56.82zM7.6 12.82c0 .73.18 1.43.5 2.06.12.24.26.46.43.66-.47-.22-.88-.53-1.22-.91-.17-.19-.32-.4-.44-.63.47-.59 1.03-1.09 1.65-1.47.09-.06.18-.12.27-.18-.48-.37-.89-.82-1.23-1.32.13-.24.29-.46.47-.66.34.37.72.7 1.14.97.23.15.45.28.66.39-.34-.21-.65-.45-.93-.71-.22-.21-.42-.44-.59-.69.39-.41.84-.76 1.33-1.06.25-.15.52-.29.8-.41-.39.21-.74.46-1.06.73-.24.2-.46.42-.66.65.39.46.84.86 1.34 1.19.26.18.51.34.75.47-.32.16-.61.34-.88.53-.21.14-.41.3-.59.47.42.34.88.62 1.36.83.25.11.51.21.78.3 0-1.83 0-3.67 0-5.5 1.43 0 2.86 0 4.29 0 0 1.83 0 3.67 0 5.5-1.43 0-2.86 0-4.29 0zm6.2-2.52c0-.73-.18-1.43-.5-2.06-.12-.24-.26-.46-.43-.66.47.22.88.53 1.22.91.17.19.32.4.44.63-.47.59-1.03 1.09-1.65 1.47-.09.06-.18.12-.27.18.48.37.89.82 1.23 1.32-.13.24-.29.46-.47.66-.34-.37-.72-.7-1.14-.97-.23-.15-.45-.28-.66-.39.34.21.65.45.93.71.22.21.42.44.59.69-.39.41-.84.76-1.33 1.06-.25.15-.52.29-.8.41.39-.21.74-.46 1.06-.73.24-.2.46-.42.66-.65-.39-.46-.84-.86-1.34-1.19-.26-.18-.51-.34-.75-.47.32-.16.61-.34.88-.53.21-.14.41-.3.59-.47-.42-.34-.88-.62-1.36-.83-.25-.11-.51-.21-.78-.3 0 1.83 0 3.67 0 5.5-1.43 0-2.86 0-4.29 0 0-1.83 0-3.67 0-5.5 1.43 0 2.86 0 4.29 0z' }
])



// 其他下拉菜单
const otherDropdownLinks = ref([
  { name: '关于', url: '/about', icon: true, iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
  { name: '帮助', url: '/help', icon: true, iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' }
])



// 主题切换
const isDark = ref(false)

// 导航栏滚动状态
const isScrolled = ref(false)
const isFixed = ref(false)
const isVisible = ref(true)
const SCROLL_THRESHOLD = 5

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 滚动检测逻辑
let scrollHandler = null
let rafId = null

function handleScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  
  rafId = requestAnimationFrame(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const bannerWrapper = document.getElementById('banner-wrapper')
    
    if (!bannerWrapper) return
    
    const bannerRect = bannerWrapper.getBoundingClientRect()
    
    if (scrollTop === 0) {
      isScrolled.value = false
      isFixed.value = false
      isVisible.value = true
    } else if (bannerRect.bottom > 0) {
      isScrolled.value = true
      isFixed.value = true
      isVisible.value = true
    } else {
      isScrolled.value = true
      isFixed.value = true
      isVisible.value = false
    }
  })
}

function initScrollDetection() {
  scrollHandler = handleScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
  handleScroll()
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % desktopBanners.length
}

const startTyping = () => {
  const text = typewriterTexts.value[textIndex.value]

  if (isDeleting.value) {
    currentText.value = text.substring(0, charIndex.value - 1)
    charIndex.value--

    if (charIndex.value === 0) {
      isDeleting.value = false
      textIndex.value = (textIndex.value + 1) % typewriterTexts.value.length
    }
  } else {
    currentText.value = text.substring(0, charIndex.value + 1)
    charIndex.value++

    if (charIndex.value === text.length) {
      isDeleting.value = true
      setTimeout(() => {
        startTyping()
      }, pauseTime)
      return
    }
  }

  setTimeout(() => {
    startTyping()
  }, isDeleting.value ? deleteSpeed : typeSpeed)
}

onMounted(() => {
  document.body.classList.add('enable-banner')
  
  interval.value = setInterval(nextSlide, 5000)
  startTyping()
  loadQuotes()
  
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  initScrollDetection()
  
  handleScroll()
})

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  document.body.classList.remove('enable-banner')
})


</script>

<template>
  <div id="banner-wrapper" class="relative w-full h-[50vh] md:h-[75vh] overflow-hidden bg-black">
    <!-- 顶部渐变高光效果 -->
    <div class="top-gradient-highlight"></div>
    
    <!-- 导航栏 - 定位在banner组件顶部 -->
    <nav class="absolute top-0 left-0 right-0 z-50 w-full">
      <div 
        ref="navbarRef" 
        id="navbar" 
        class="max-w-[90rem] h-18 mx-auto flex items-center justify-between px-6 transition-all duration-400 ease-in-out"
        :class="{
          'navbar-transparent': !isScrolled && !isFixed,
          'navbar-scrolled': isScrolled && isFixed && isVisible,
          'navbar-hidden': !isVisible
        }"
        data-transparent-mode="semifull" 
        data-is-home="true"
      >
        <!-- Logo/标题 -->
        <router-link to="/" class="btn-plain scale-animation rounded-lg h-13 px-5 font-bold active:scale-95 shrink-0 transition-all duration-300">
          <div class="flex flex-row items-center text-md">
            <img 
              src="/assets/home/default-logo.png" 
              alt="Mizuki" 
              class="h-13 max-w-full object-contain transition-all duration-300" 
              loading="lazy" 
            />
          </div>
        </router-link>
        
        <!-- 导航链接 -->
        <div id="navbar-links-container" class="flex items-center space-x-1 transition-opacity duration-300">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name"
            :to="link.url"
            class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-90 transition-all"
          >
            <span class="flex items-center gap-2">
              <svg v-if="link.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                <path :d="link.iconPath" />
              </svg>
              {{ link.name }}
            </span>
          </router-link>
          
          <!-- 链接下拉菜单 -->
          <div class="relative group">
            <button class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-90 transition-all flex items-center gap-2">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              链接
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" class="transition-transform group-hover:rotate-180">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div class="absolute top-full left-0 mt-1 w-48 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--line-divider)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <a 
                v-for="child in linkDropdownLinks" 
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
          
          <!-- 我的链接 -->
          <router-link 
            to="/about"
            class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-90 transition-all flex items-center gap-2"
          >
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            我的
          </router-link>
          
          <!-- 其他下拉菜单 -->
          <div class="relative group">
            <button class="btn-plain scale-animation rounded-lg h-11 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 active:scale-90 transition-all flex items-center gap-2">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 14q-.825 0-1.412-.587T4 12t.588-1.412T6 10t1.413.588T8 12t-.587 1.412T6 14zm6 0q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.412T12 14zm6 0q-.825 0-1.412-.587T16 12t.588-1.412T18 10t1.413.588T20 12t-.587 1.412T18 14z"/>
              </svg>
              其他
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" class="transition-transform group-hover:rotate-180">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <div class="absolute top-full left-0 mt-1 w-48 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--line-divider)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button 
                v-for="child in otherDropdownLinks" 
                :key="child.name"
                @click="router.push(child.url)"
                class="flex items-center gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-hover)] first:rounded-t-lg last:rounded-b-lg transition-colors w-full"
              >
                <svg v-if="child.icon" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                  <path :d="child.iconPath" />
                </svg>
                {{ child.name }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 右侧功能按钮 -->
        <div class="flex items-center gap-1">
          <!-- 主题切换按钮 -->
          <button 
            aria-label="Toggle Dark Mode" 
            class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 text-gray-700 hover:text-gray-900 transition-all"
            @click="toggleTheme"
          >
            <svg v-if="isDark" width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
            <svg v-else width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2c-1.05 0-2.05.16-3 .46 1.69 1.24 2.79 3.24 2.79 5.54 0 3.87-3.13 7-7 7-1.1 0-2.14-.26-3.07-.72C.97 18.5 4.49 22 9 22c5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
            </svg>
          </button>
        </div>
      </div>
      

    </nav>
    
    <div class="banner-container relative w-full h-full">
      <div 
        v-for="(banner, index) in desktopBanners" 
        :key="index"
        class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-1000"
        :class="{ 'opacity-100': currentIndex === index, 'opacity-0': currentIndex !== index }"
      >
        <img 
          :src="banner" 
          :alt="`Banner ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </div>
      
      <div class="banner-text-overlay absolute inset-0 z-20 flex items-center justify-center">
        <div class="max-w-[90rem] w-full px-4 mx-auto flex items-center justify-center h-full">
          <div class="w-3/4 text-center">
            <div class="flex flex-col">
              <h1 class="banner-title text-6xl lg:text-8xl text-white drop-shadow-lg mb-2 lg:mb-4">
                わたしの部屋
              </h1>
              <h2 class="banner-subtitle text-xl lg:text-3xl text-white/90 drop-shadow-md">
                <span class="inline-block min-h-[1.2em]">
                  {{ currentText }}
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      <div class="waves absolute -bottom-px h-[10vh] max-h-[80px] min-h-[60px] w-full" id="header-waves" style="transform: translateZ(0); will-change: fill;">
        <svg
          class="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 20 150 32"
          preserveAspectRatio="none"
          shape-rendering="auto"
          style="transform: translateZ(0); backface-visibility: hidden;"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v48h-352z"
            >
            </path>
          </defs>
          
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            class="wave-layer"
            style="animation-delay: -2s; animation-duration: 7s; will-change: transform; opacity: 0.25; fill: var(--page-bg);"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            class="wave-layer"
            style="animation-delay: -3s; animation-duration: 10s; will-change: transform; opacity: 0.5; fill: var(--page-bg);"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            class="wave-layer"
            style="animation-delay: -4s; animation-duration: 13s; will-change: transform; opacity: 0.75; fill: var(--page-bg);"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            class="wave-layer"
            style="animation-delay: -5s; animation-duration: 20s; will-change: transform; opacity: 1; fill: var(--page-bg);"
          ></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-title {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  animation: fadeInUp 1s ease-out;
  font-weight: bold;
}

.banner-subtitle {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  animation: fadeInUp 1s ease-out 0.3s both;
  min-height: 1.5em;
  line-height: 1.2;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wave {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

.wave-layer {
  animation: wave 25s cubic-bezier(0.5, 0.5, 0.45, 0.5) infinite;
}

/* 水波纹显示优化 */
.waves {
  /* 确保水波纹完整显示 */
  overflow: visible;
  z-index: 5;
  /* 硬件加速，确保与背景同步渲染 */
  transform: translateZ(0);
  will-change: transform;
  /* 确保与页面背景在同一合成层 */
  contain: layout style paint;
}

.waves svg {
  /* 确保SVG完整渲染 */
  width: 100%;
  height: 100%;
  display: block;
  /* SVG硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 波浪填充色主题切换优化 */
.waves use {
  /* 确保填充色与页面背景同步更新 */
  will-change: fill;
}

/* 波浪与背景同步切换优化 - 解决交界线闪烁 */
#header-waves {
  /* 确保波浪容器与页面背景在同一合成层 */
  isolation: isolate;
  /* 强制重绘，确保与body背景同步 */
  contain: layout style paint;
  /* 精确对齐 */
  margin-bottom: -1px;
}

/* 导航栏滚动状态样式 */
#navbar {
  transition: all 0.4s ease-in-out;
  will-change: transform, opacity, background, backdrop-filter;
}

/* 状态 A：导航栏透明状态 - 页面顶部 */
.navbar-transparent {
  background: transparent !important;
  backdrop-filter: none !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* 状态 B：导航栏滚动状态 - 毛玻璃效果 */
.navbar-scrolled {
  background: var(--card-bg-transparent) !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-std) !important;
  position: fixed !important;
  top: 0.5rem !important;
  left: 0 !important;
  right: 0 !important;
  width: 95% !important;
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* 状态 C：导航栏隐藏状态 - 平滑消失 */
.navbar-hidden {
  background: var(--card-bg-transparent) !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-std) !important;
  position: fixed !important;
  top: 0.5rem !important;
  left: 0 !important;
  right: 0 !important;
  width: 95% !important;
  transform: translateY(-100%) !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* 深色模式下的滚动状态样式 */
.dark .navbar-scrolled {
  background: rgba(0, 0, 0, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.dark .navbar-hidden {
  background: rgba(0, 0, 0, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

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
  background: rgba(255, 255, 255, 0.1);
}

.scale-animation {
  transition: transform 0.2s ease;
}

.scale-animation:active {
  transform: scale(0.95);
}
</style>