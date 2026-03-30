<script setup>
</script>

<template>
  <div class="main-layout-container min-h-screen flex flex-col">
    <!-- 主内容区 -->
    <main class="flex-1 bg-[var(--page-bg)]">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="bg-[var(--card-bg)] border-t border-[var(--line-divider)] py-6">
      <div class="container mx-auto px-4 text-center text-[var(--text-secondary)]">
        <p>© 2024 MizukiBlog. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout-container {
  font-family: 'ZenMaruGothic-Medium', '萝莉体 第二版', sans-serif;
}
</style>