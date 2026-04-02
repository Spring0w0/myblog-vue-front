<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import Banner from '../../components/common/Banner.vue'
import SiteStats from '../../components/widget/SiteStats.vue'
import Calendar from '../../components/widget/Calendar.vue'
import Tags from '../../components/widget/Tags.vue'
import Categories from '../../components/widget/Categories.vue'
import Announcement from '../../components/widget/Announcement.vue'
import ProfileCard from '../../components/widget/ProfileCard.vue'
import { parseTags } from '../../utils/imageHelper.js'
import { articleApi } from '../../api/articleApi.js'
import apiClient from '../../api/client.js'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const loading = ref(true)
const error = ref(null)
const toc = ref([])
const activeSection = ref('')

// 标签和分类相关变量
const selectedTagIds = ref([])
const selectedTagNames = ref([])
const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')

// 处理标签点击
const handleTagClick = (tag) => {
  const index = selectedTagIds.value.indexOf(tag.id)
  if (index > -1) {
    selectedTagIds.value.splice(index, 1)
    selectedTagNames.value.splice(index, 1)
  } else if (selectedTagIds.value.length < 3) {
    selectedTagIds.value.push(tag.id)
    selectedTagNames.value.push(tag.name)
  }
}

// 处理分类点击
const handleCategoryClick = (category) => {
  if (selectedCategoryId.value === category.id) {
    selectedCategoryId.value = null
    selectedCategoryName.value = ''
  } else {
    selectedCategoryId.value = category.id
    selectedCategoryName.value = category.name
  }
}

// 重置筛选
const resetFilters = () => {
  selectedTagIds.value = []
  selectedTagNames.value = []
  selectedCategoryId.value = null
  selectedCategoryName.value = ''
}

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.error(e)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true,
  headerIds: true
})

const parsedTags = computed(() => {
  if (!article.value || !article.value.tags) return []
  return parseTags(article.value.tags)
})

const parsedCategories = computed(() => {
  if (!article.value || !article.value.categories) return ''
  return article.value.categories
})

const renderedContent = computed(() => {
  if (!article.value || !article.value.content) return ''
  try {
    return marked(article.value.content)
  } catch (e) {
    console.error('Markdown 渲染失败:', e)
    return article.value.content
  }
})

// 生成文章导航目录
const generateTOC = () => {
  if (!article.value || !article.value.content) {
    toc.value = []
    return
  }
  
  const content = article.value.content
  const headers = content.match(/^#{1,3}\s+.+/gm)
  
  if (!headers) {
    toc.value = []
    return
  }
  
  const newTOC = headers.map((header, index) => {
    const level = (header.match(/^#+/)[0]).length
    const text = header.replace(/^#+/, '').trim()
    const id = `toc-${index}`
    return {
      id,
      text,
      level
    }
  })
  
  toc.value = newTOC
}

// 滚动到指定章节
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

// 监听滚动，更新当前活跃章节
const handleScroll = () => {
  const sections = document.querySelectorAll('h1, h2, h3')
  let current = ''
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop
    if (window.scrollY >= sectionTop - 100) {
      current = section.id
    }
  })
  
  if (current !== activeSection.value) {
    activeSection.value = current
  }
}

const loadArticle = async () => {
  console.log('路由参数:', route.params);
  console.log('文章ID:', route.params.id);
  loading.value = true
  error.value = null
  
  const articleId = route.params.id
  
  if (!articleId) {
    error.value = '文章ID无效'
    loading.value = false
    return
  }
  
  try {
    // 使用默认模块.openapi.yaml中定义的接口
    const response = await apiClient.get(`/article/${articleId}`)
    
    if (response.success && response.data) {
      article.value = response.data
      // 延迟生成TOC，确保内容已渲染
      nextTick(() => {
        generateTOC()
      })
    } else {
      error.value = response.message || '文章不存在'
    }
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = '加载文章失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 返回文章列表页
const goBack = () => {
  router.push('/')
}

watch(() => article.value, () => {
  if (article.value) {
    nextTick(() => {
      generateTOC()
    })
  }
})

onMounted(() => {
  loadArticle()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="article-detail-container">
    <Banner />
    
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-3">
          <!-- 返回按钮 -->
          <div class="mb-6">
            <button
              @click="goBack"
              class="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors duration-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              返回文章列表
            </button>
          </div>
          
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
        
        <div class="lg:col-span-6">
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <article v-else-if="article" class="bg-[var(--card-bg)] rounded-xl shadow-md p-8">
            <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
              {{ article.title }}
            </h1>
            
            <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
          </article>
        </div>
        
        <div class="lg:col-span-3">
          <!-- 文章导航 -->
          <div v-if="toc.length > 0" class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
            <h3 class="font-bold text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-4 flex items-center gap-2
              before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
              before:absolute before:left-[-16px] before:top-[5.5px]">
              文章导航
            </h3>
            <div class="px-4">
              <ul class="space-y-2">
                <li v-for="item in toc" :key="item.id" :class="['py-1', { 'text-[var(--primary)] font-medium': activeSection === item.id }]">
                  <a 
                    @click="scrollToSection(item.id)"
                    :class="[
                      'block px-3 py-1 rounded-md hover:bg-[var(--card-hover)] transition-colors duration-300',
                      'text-sm',
                      { 'text-[var(--primary)] font-medium': activeSection === item.id },
                      { 'pl-0': item.level === 1 },
                      { 'pl-4': item.level === 2 },
                      { 'pl-8': item.level === 3 }
                    ]"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <SiteStats />
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-detail-container {
  min-height: calc(100vh - 64px);
}

@media (min-width: 1024px) {
  .article-detail-container {
    padding-bottom: 4rem;
  }
}

:deep(.prose) {
  color: var(--text-primary);
}

:deep(.prose h1) {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(.prose h2) {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--line-divider);
  padding-bottom: 0.5rem;
}

:deep(.prose h3) {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.prose p) {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

:deep(.prose ul),
:deep(.prose ol) {
  color: var(--text-secondary);
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
}

:deep(.prose code) {
  background-color: var(--card-hover);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--primary);
}

:deep(.prose pre) {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

:deep(.prose pre code) {
  background-color: transparent;
  padding: 0;
  color: #d4d4d4;
  font-size: 0.875rem;
}

:deep(.prose blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
  font-style: italic;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

:deep(.prose a) {
  color: var(--primary);
  text-decoration: underline;
}

:deep(.prose a:hover) {
  color: var(--primary-hover);
}

:deep(.prose hr) {
  border-color: var(--line-divider);
  margin: 2rem 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

:deep(.prose th),
:deep(.prose td) {
  border: 1px solid var(--line-divider);
  padding: 0.5rem;
  text-align: left;
}

:deep(.prose th) {
  background-color: var(--card-hover);
  font-weight: 600;
}
</style>
