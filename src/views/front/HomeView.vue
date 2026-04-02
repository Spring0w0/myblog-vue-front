<script setup>
import { ref, onMounted } from 'vue'
import Banner from '../../components/common/Banner.vue'
import ArticleCard from '../../components/article/ArticleCard.vue'
import SiteStats from '../../components/widget/SiteStats.vue'
import Calendar from '../../components/widget/Calendar.vue'
import Announcement from '../../components/widget/Announcement.vue'
import Tags from '../../components/widget/Tags.vue'
import Categories from '../../components/widget/Categories.vue'
import ProfileCard from '../../components/widget/ProfileCard.vue'
import { articleApi } from '../../api/articleApi.js'

const posts = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 6
const error = ref(null)

const selectedTagIds = ref([])
const selectedTagNames = ref([])
const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')

const handleTagClick = (tag) => {
  const index = selectedTagIds.value.indexOf(tag.id)
  if (index > -1) {
    selectedTagIds.value.splice(index, 1)
    selectedTagNames.value.splice(index, 1)
  } else if (selectedTagIds.value.length < 3) {
    selectedTagIds.value.push(tag.id)
    selectedTagNames.value.push(tag.name)
  }
  currentPage.value = 1
  loadPosts(1)
}

const handleCategoryClick = (category) => {
  if (selectedCategoryId.value === category.id) {
    selectedCategoryId.value = null
    selectedCategoryName.value = ''
  } else {
    selectedCategoryId.value = category.id
    selectedCategoryName.value = category.name
  }
  currentPage.value = 1
  loadPosts(1)
}

const resetFilters = () => {
  selectedTagIds.value = []
  selectedTagNames.value = []
  selectedCategoryId.value = null
  selectedCategoryName.value = ''
  currentPage.value = 1
  loadPosts(1)
}

const loadPosts = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const response = await articleApi.getArticles(page, pageSize, {
      tagIds: selectedTagIds.value,
      categoryId: selectedCategoryId.value
    })
    if (response.success && response.data) {
      posts.value = response.data.list || []
      const total = response.data.total || 0
      totalPages.value = Math.ceil(total / pageSize)
      currentPage.value = page
    } else {
      error.value = response.message || '加载文章失败'
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
          <ProfileCard />

          <!-- 公告 -->
          <Announcement />
          
          <!-- 标签 -->
          <Tags
            :active-tag-ids="selectedTagIds"
            @tag-click="handleTagClick"
          />

          <!-- 分类 -->
          <Categories
            :active-category-id="selectedCategoryId"
            @category-click="handleCategoryClick"
          />
        </div>
        
        <!-- 中间 - 文章列表 -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">最新文章</h2>
            <div class="h-1 w-20 bg-[var(--primary)] rounded-full"></div>
          </div>
          
          <!-- 筛选状态显示 -->
          <div v-if="selectedTagNames.length > 0 || selectedCategoryName" class="mb-4 flex flex-wrap gap-2">
            <span
              v-for="tagName in selectedTagNames"
              :key="tagName"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary)] text-white"
            >
              标签: {{ tagName }}
            </span>
            <span v-if="selectedCategoryName" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--primary)] text-white">
              分类: {{ selectedCategoryName }}
            </span>
            <button
              @click="resetFilters"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors duration-300"
            >
              重置筛选
            </button>
          </div>

          <!-- 文章卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCard
              v-for="article in posts"
              :key="article.id"
              :article="article"
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
          <div v-if="!loading && posts.length === 0" class="text-center py-12 bg-[var(--card-bg)] rounded-xl shadow-md p-8">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-20 h-20 text-[var(--text-tertiary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-2">未找到文章</h3>
              <p class="text-sm text-[var(--text-secondary)] mb-6">
                {{ selectedTagNames.length > 0 || selectedCategoryName ? '没有符合当前筛选条件的文章' : '暂无文章' }}
              </p>
              <button 
                @click="resetFilters"
                class="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors duration-300"
              >
                重置所有筛选
              </button>
            </div>
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
  /* 移除固定高度计算，使用 flex 布局自然伸展 */
}

/* 呼吸感布局 */
@media (min-width: 1024px) {
  .home-container {
    padding-bottom: 4rem;
  }
}
</style>
