<template>
  <div class="p-5" v-loading="loading">
    <h1 class="text-2xl font-bold mb-6">后台概览</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">总文章数</p>
            <h3 class="text-2xl font-bold mt-1">{{ stats.articleNum }}</h3>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">总分类数</p>
            <h3 class="text-2xl font-bold mt-1">{{ stats.categoryNum }}</h3>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">总标签数</p>
            <h3 class="text-2xl font-bold mt-1">{{ stats.tagNum }}</h3>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h2 class="text-lg font-semibold mb-4">近期文章</h2>
        <div class="space-y-3">
          <div
            v-for="(item, index) in recentArticles"
            :key="index"
            class="flex items-center justify-between p-3"
            :class="{ 'border-b border-gray-100': index < recentArticles.length - 1 }"
          >
            <span class="truncate mr-4">{{ item.title }}</span>
            <span class="text-sm text-gray-500 whitespace-nowrap">{{ formatTime(item.updateTime) }}</span>
          </div>
          <div v-if="recentArticles.length === 0" class="text-center text-gray-400 py-4">暂无数据</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4">
        <h2 class="text-lg font-semibold mb-4">热度文章</h2>
        <div class="space-y-3">
          <div
            v-for="(item, index) in hotArticles"
            :key="index"
            class="flex items-center justify-between p-3"
            :class="{ 'border-b border-gray-100': index < hotArticles.length - 1 }"
          >
            <span class="truncate mr-4">{{ item.title }}</span>
            <span class="text-sm text-blue-500 whitespace-nowrap">{{ formatCount(item.viewCount) }} 阅读</span>
          </div>
          <div v-if="hotArticles.length === 0" class="text-center text-gray-400 py-4">暂无数据</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4">
      <h2 class="text-lg font-semibold mb-4">草稿箱</h2>
      <div class="space-y-3">
        <div
          v-for="(item, index) in drafts"
          :key="index"
          class="flex items-center justify-between p-3"
          :class="{ 'border-b border-gray-100': index < drafts.length - 1 }"
        >
          <span class="truncate mr-4">{{ item.title }}</span>
          <span class="text-sm text-gray-500 whitespace-nowrap">上次编辑：{{ formatTime(item.updateTime) }}</span>
        </div>
        <div v-if="drafts.length === 0" class="text-center text-gray-400 py-4">暂无草稿</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { dashboardApi } from '@/api/dashboardApi'

const loading = ref(false)

const stats = reactive({
  articleNum: 0,
  categoryNum: 0,
  tagNum: 0
})

const recentArticles = ref([])
const hotArticles = ref([])
const drafts = ref([])

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatCount = (count) => {
  if (count == null) return '0'
  return count.toLocaleString()
}

const loadDashboard = async () => {
  loading.value = true
  try {
    const [articleNumRes, categoryNumRes, tagNumRes, hotRes, recentRes, draftRes] = await Promise.all([
      dashboardApi.getArticleNum(),
      dashboardApi.getCategoryNum(),
      dashboardApi.getTagNum(),
      dashboardApi.getHotArticles(),
      dashboardApi.getRecentArticles(),
      dashboardApi.getDrafts()
    ])

    if (articleNumRes.success && articleNumRes.data) {
      stats.articleNum = articleNumRes.data.articleNum || 0
    }
    if (categoryNumRes.success && categoryNumRes.data) {
      stats.categoryNum = categoryNumRes.data.categoryNum || 0
    }
    if (tagNumRes.success && tagNumRes.data) {
      stats.tagNum = tagNumRes.data.tagNum || 0
    }
    if (hotRes.success && hotRes.data) {
      hotArticles.value = hotRes.data
    }
    if (recentRes.success && recentRes.data) {
      recentArticles.value = recentRes.data
    }
    if (draftRes.success && draftRes.data) {
      drafts.value = draftRes.data
    }
  } catch (error) {
    console.error('加载仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
