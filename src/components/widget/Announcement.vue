<template>
  <div v-if="showAnnouncement" class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      公告
    </h3>
    <div class="px-4">
      <div class="text-[var(--text-secondary)] leading-relaxed mb-3">
        {{ announcementContent }}
      </div>
      <div class="flex items-center justify-between gap-3">
        <div>
          <a href="#" class="bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] active:scale-95 transition-all">
            Learn More
          </a>
        </div>
        <button 
          @click="closeAnnouncement"
          class="bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-lg h-8 w-8 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors"
          aria-label="关闭"
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showAnnouncement = ref(true)
const announcementContent = ref('ブログへようこそ！これはサンプルの告知です')

const closeAnnouncement = () => {
  showAnnouncement.value = false
}

onMounted(() => {
  // 从localStorage读取公告内容
  const savedAnnouncement = localStorage.getItem('blog_announcement')
  if (savedAnnouncement) {
    try {
      const announcement = JSON.parse(savedAnnouncement)
      if (announcement.content) {
        announcementContent.value = announcement.content
      }
    } catch (error) {
      console.error('读取公告失败:', error)
    }
  }
})
</script>

<style scoped>
</style>