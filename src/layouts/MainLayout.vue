<script setup>
import NavBar from '../components/common/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--page-bg)] transition-colors duration-150">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主内容区域 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="mt-auto py-8 border-t border-[var(--line-divider)] bg-[var(--card-bg)]">
      <div class="max-w-[90rem] mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img
              src="/assets/home/home.png"
              alt="Icon"
              class="h-6 w-auto opacity-60"
            />
            <span class="text-sm text-[var(--text-tertiary)]">
              © {{ new Date().getFullYear() }} Mizuki. All rights reserved.
            </span>
          </div>

          <div class="flex items-center gap-6">
            <a
              href="https://github.com/matsuzaka-yuki/Mizuki"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-150"
            >
              GitHub
            </a>
            <router-link
              to="/about"
              class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-150"
            >
              关于
            </router-link>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-[var(--line-divider)] text-center">
          <p class="text-xs text-[var(--text-tertiary)]">
            Powered by Vue 3 + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>