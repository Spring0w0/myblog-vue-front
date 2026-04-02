<script setup>
import { ref, onMounted } from 'vue'
import { statsApi } from '../../api/statsApi.js'

const runningDays = ref(0)
const lastUpdate = ref(0)
const stats = ref({
  totalPosts: 0,
  totalTags: 0,
  totalCategories: 0,
  totalViews: 0
})
const loading = ref(true)

/**
 * 计算运行天数
 */
const calculateRunningDays = () => {
  const startDate = new Date('2026-03-01')
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  runningDays.value = diffDays
}

/**
 * 计算最后活动时间
 */
const calculateLastUpdate = (latestArticleTime) => {
  if (!latestArticleTime) {
    lastUpdate.value = 0
    return
  }
  const lastPostDate = new Date(latestArticleTime)
  const today = new Date()
  const diffTime = Math.abs(today - lastPostDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  lastUpdate.value = diffDays
}

/**
 * 加载统计数据
 * 防御性处理：确保在接口返回 null 或非预期格式时页面不崩溃
 */
const loadStats = async () => {
  loading.value = true
  try {
    const response = await statsApi.getStats()

    // 防御性处理：检查返回格式
    if (response && response.success && typeof response.data === 'object') {
      const data = response.data
      stats.value = {
        totalPosts: data.articleTotal || 0,
        totalTags: data.tagTotal || 0,
        totalCategories: data.categoryTotal || 0,
        totalViews: data.totalViewCount || 0
      }
      // 使用接口返回的最后活跃时间计算最后活动时间
      calculateLastUpdate(data.latestArticleTime)
    } else {
      console.warn('统计数据格式异常，使用默认值')
      stats.value = {
        totalPosts: 0,
        totalTags: 0,
        totalCategories: 0,
        totalViews: 0
      }
      calculateLastUpdate(null)
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    stats.value = {
      totalPosts: 0,
      totalTags: 0,
      totalCategories: 0,
      totalViews: 0
    }
    calculateLastUpdate(null)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  calculateRunningDays()
  loadStats()
})
</script>

<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      站点统计
    </h3>
    <div class="px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-4">
        <svg class="animate-spin h-5 w-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- 统计数据列表 -->
      <div v-else class="flex flex-col gap-1">
        <!-- 文章数 -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 17h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm0 0V5z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              文章
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              {{ stats.totalPosts }}
            </span>
          </div>
        </div>

        <!-- 分类数 -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm0-2h16V8h-8.825l-2-2H4zm0 0V6z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              分类
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              {{ stats.totalCategories }}
            </span>
          </div>
        </div>

        <!-- 标签数 -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h11q.475 0 .9.213t.7.587L22 12l-5.4 7.2q-.275.375-.7.588T15 20zm0-2h11l4.5-6L15 6H4zm5.5-6"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              标签
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              {{ stats.totalTags }}
            </span>
          </div>
        </div>

        <!-- 总阅读量（新增） -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              总阅读
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              {{ stats.totalViews }}
            </span>
          </div>
        </div>

        <!-- 运行天数 -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 8h14V6H5zm0 0V6zm0 14q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v5.675q-.475-.225-.975-.375T19 11.075V10H5v10h6.3q.175.55.413 1.05t.562.95zm9.463-.462Q13 20.075 13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23t-3.537-1.463m5.212-1.162l.7-.7L18.5 17.8V15h-1v3.2z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              运行天数
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]" data-stat-id="running-days">
              {{ runningDays }}
            </span>
            <span class="text-sm text-[var(--text-tertiary)] ml-1">
              天
            </span>
          </div>
        </div>

        <!-- 最后活动 -->
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21q-.45 0-.862-.162t-.738-.488l-6.7-6.725q-.875-.875-1.287-2T2 9.275Q2 6.7 3.675 4.85T7.85 3q1.2 0 2.263.475T12 4.8q.8-.85 1.863-1.325T16.125 3q2.5 0 4.188 1.85T22 9.25q0 1.225-.425 2.35t-1.275 2l-6.725 6.75q-.325.325-.725.488T12 21m1-13q.25 0 .475.125t.35.325l1.7 2.55h4.15q.175-.425.263-.862t.087-.888q-.05-1.725-1.15-2.963t-2.75-1.237q-.775 0-1.487.3t-1.238.875l-.675.725q-.125.15-.325.238t-.4.087t-.4-.087t-.35-.238l-.675-.725q-.525-.575-1.225-.9T7.85 5Q6.2 5 5.1 6.263T4 9.25q0 .45.075.888t.25.862H9q.25 0 .475.125t.35.325l.875 1.3l1.35-4.05q.1-.3.362-.5T13 8m.3 3.25l-1.35 4.05q-.1.3-.375.5t-.6.2q-.25 0-.475-.125t-.35-.325L8.45 13H5.9l5.925 5.925q.05.05.088.063T12 19t.088-.012t.087-.063l5.9-5.925H15q-.25 0-.475-.125t-.375-.325z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              最后活动
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]" data-stat-id="last-update">
              {{ lastUpdate }}
            </span>
            <span class="text-sm text-[var(--text-tertiary)] ml-1">
              天前
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
