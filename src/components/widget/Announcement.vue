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