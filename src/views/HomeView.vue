<script setup>
import { ref, onMounted, computed } from 'vue'
import Banner from '../components/common/Banner.vue'
import PostCard from '../components/post/PostCard.vue'
import SiteStats from '../components/widget/SiteStats.vue'
import Calendar from '../components/widget/Calendar.vue'
import Announcement from '../components/widget/Announcement.vue'
import Tags from '../components/widget/Tags.vue'
import Categories from '../components/widget/Categories.vue'
import { postApi } from '../api/postApi.js'

const posts = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const error = ref(null)

const loadPosts = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await postApi.getPosts(page, 6)
    if (response.success) {
      posts.value = response.data.posts
      totalPages.value = response.data.totalPages
      currentPage.value = response.data.page
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '加载文章失败，请稍后重试'
    console.error('加载文章失败:', err)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadPosts(page)
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="home-container">
    <!-- Banner -->
    <Banner />
    
    <!-- 主内容区域 -->
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧边栏 - 个人信息 -->
        <div class="lg:col-span-1">
          <!-- 个人信息卡片 -->
          <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
            <div class="flex flex-col items-center text-center">
              <div class="w-24 h-24 rounded-full overflow-hidden mb-4">
                <img 
                  src="/assets/images/avatar.webp" 
                  alt="头像"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Mizuki</h3>
              <p class="text-sm text-[var(--text-secondary)] mb-4">One demo website</p>
              <div class="flex justify-center space-x-4">
                <a href="#" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"></path>
                  </svg>
                </a>
                <a href="#" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0V16h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548V16z"></path>
                  </svg>
                </a>
                <a href="#" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 公告 -->
          <Announcement />
          
          <!-- 标签 -->
          <Tags />
          
          <!-- 分类 -->
          <Categories />
        </div>
        
        <!-- 中间 - 文章列表 -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">最新文章</h2>
            <div class="h-1 w-20 bg-[var(--primary)] rounded-full"></div>
          </div>
          
          <!-- 文章卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostCard 
              v-for="post in posts" 
              :key="post.id" 
              :post="post"
            />
          </div>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
          
          <!-- 错误状态 -->
          <div v-if="error && !loading" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <!-- 空状态 -->
          <div v-if="!loading && posts.length === 0" class="text-center py-12">
            <p class="text-[var(--text-secondary)]">暂无文章</p>
          </div>
          
          <!-- 分页 -->
          <div v-if="!loading && totalPages > 1" class="mt-8 flex justify-center">
            <nav class="inline-flex rounded-md shadow">
              <button 
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-l-md hover:bg-[var(--card-hover)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="handlePageChange(page)"
                class="px-4 py-2 text-sm font-medium border-y border-[var(--line-divider)] hover:bg-[var(--card-hover)] transition-colors duration-300"
                :class="{
                  'bg-[var(--primary)] text-white': currentPage === page,
                  'text-[var(--text-secondary)] bg-[var(--card-bg)]': currentPage !== page
                }"
              >
                {{ page }}
              </button>
              
              <button 
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-r-md hover:bg-[var(--card-hover)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </nav>
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
.home-container {
  min-height: calc(100vh - 64px);
}

/* 呼吸感布局 */
@media (min-width: 1024px) {
  .home-container {
    padding-bottom: 4rem;
  }
}
</style>
