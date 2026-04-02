<template>
  <div v-if="showAnnouncement && !loading && announcementContent" class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
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
import apiClient from '../../api/client.js'

const showAnnouncement = ref(true)
const announcementContent = ref('')
const loading = ref(true)

const loadAnnouncement = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/setting')
    if (response && response.success && Array.isArray(response.data)) {
      const announcement = response.data.find(item => item.configKey === 'site_announcement')
      if (announcement) {
        const value = announcement.configValue
        announcementContent.value = Array.isArray(value) ? value.join('') : (value || '')
      }
    }
  } catch (error) {
    console.error('加载公告失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnnouncement()
})
</script>

<style scoped>
</style>