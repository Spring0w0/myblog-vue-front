<script setup>
import { ref, onMounted, computed } from 'vue'
import Banner from '../../components/common/Banner.vue'
import SiteStats from '../../components/widget/SiteStats.vue'
import Calendar from '../../components/widget/Calendar.vue'
import Announcement from '../../components/widget/Announcement.vue'
import Tags from '../../components/widget/Tags.vue'
import Categories from '../../components/widget/Categories.vue'
import ProfileCard from '../../components/widget/ProfileCard.vue'
import { articleApi } from '../../api/articleApi.js'

const archiveData = ref([])
const loading = ref(true)
const error = ref(null)

// 按年份分组
const groupedArchive = computed(() => {
  const grouped = archiveData.value.reduce((acc, article) => {
    const date = new Date(article.updateTime)
    const year = date.getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(article)
    return acc
  }, {})
  
  return Object.keys(grouped)
    .map(year => ({
      year: parseInt(year),
      posts: grouped[year]
    }))
    .sort((a, b) => b.year - a.year)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 加载归档数据
const loadArchive = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await articleApi.getArchive()
    if (response.success) {
      archiveData.value = response.data
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '获取归档数据失败'
    console.error('加载归档数据失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArchive()
})
</script>

<template>
  <div class="archive-container">
    <!-- Banner -->
    <Banner />
    
    <!-- 主内容区域 -->
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧边栏 - 个人信息 -->
        <div class="lg:col-span-1">
          <!-- 个人信息卡片 -->
          <ProfileCard />

          <!-- 公告 -->
          <Announcement />
          
          <!-- 标签 -->
          <Tags />

          <!-- 分类 -->
          <Categories />
        </div>
        
        <!-- 中间 - 归档时间线 -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">文章归档</h2>
            <div class="h-1 w-20 bg-[var(--primary)] rounded-full"></div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <!-- 归档时间线 -->
          <div v-else-if="groupedArchive.length > 0" class="bg-[var(--card-bg)] rounded-xl shadow-md p-6">
            <div v-for="group in groupedArchive" :key="group.year" class="mb-8">
              <!-- 年份标题 -->
              <div class="flex flex-row w-full items-center mb-4">
                <div class="w-[15%] md:w-[10%] text-2xl font-bold text-right text-[var(--text-primary)]">
                  {{ group.year }}
                </div>
                <div class="w-[15%] md:w-[10%]">
                  <div class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-2 z-50 outline-3"></div>
                </div>
                <div class="w-[70%] md:w-[80%] text-left text-[var(--text-secondary)]">
                  {{ group.posts.length }} {{ group.posts.length === 1 ? '篇文章' : '篇文章' }}
                </div>
              </div>
              
              <!-- 文章时间线 -->
              <div v-for="post in group.posts" :key="post.id" class="mb-3">
                <a 
                  :href="`/article/${post.id}`"
                  class="group flex flex-row justify-start items-center w-full py-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors duration-300"
                >
                  <!-- 日期 -->
                  <div class="w-[15%] md:w-[10%] text-sm text-right text-[var(--text-secondary)]">
                    {{ formatDate(post.updateTime) }}
                  </div>
                  
                  <!-- 连接线和点 -->
                  <div class="w-[15%] md:w-[10%] relative dash-line h-12 flex items-center">
                    <div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5 bg-[var(--text-tertiary)] group-hover:bg-[var(--primary)] outline outline-4 z-50 outline-[var(--card-bg)] group-hover:outline-[var(--card-hover)]"></div>
                  </div>
                  
                  <!-- 标题 -->
                  <div class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)] text-[var(--text-primary)] pr-8 whitespace-nowrap text-ellipsis overflow-hidden">
                    {{ post.title }}
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="text-center py-12 bg-[var(--card-bg)] rounded-xl shadow-md p-8">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-20 h-20 text-[var(--text-tertiary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">暂无文章归档</h3>
              <p class="text-sm text-[var(--text-secondary)] mb-6">
                目前还没有文章归档
              </p>
            </div>
          </div>
        </div>
        
        <!-- 右侧边栏 - 站点统计和日历 -->
        <div class="lg:col-span-1">
          <SiteStats />
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive-container {
  /* 移除固定高度计算，使用 flex 布局自然伸展 */
}

/* 呼吸感布局 */
@media (min-width: 1024px) {
  .archive-container {
    padding-bottom: 4rem;
  }
}

.dash-line::before {
  content: "";
  position: absolute;
  width: 10%;
  height: 100%;
  left: calc(50% - 1px);
  border-left: 2px dashed var(--line-divider);
  pointer-events: none;
  transition: all 0.3s;
  transform: translateY(-50%);
}
</style>
