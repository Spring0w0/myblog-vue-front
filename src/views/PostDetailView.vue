<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import Banner from '../components/common/Banner.vue'
import SiteStats from '../components/widget/SiteStats.vue'
import Calendar from '../components/widget/Calendar.vue'
import { postApi } from '../api/postApi.js'
import { parseTags } from '../utils/imageHelper.js'

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const error = ref(null)

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
  gfm: true
})

const parsedTags = computed(() => {
  if (!post.value || !post.value.tags) return []
  return parseTags(post.value.tags)
})

const parsedCategories = computed(() => {
  if (!post.value || !post.value.categories) return ''
  return post.value.categories
})

const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return ''
  try {
    return marked(post.value.content)
  } catch (e) {
    console.error('Markdown 渲染失败:', e)
    return post.value.content
  }
})

const loadPost = async () => {
  loading.value = true
  error.value = null
  
  const postId = route.params.id
  
  if (!postId) {
    error.value = '文章ID无效'
    loading.value = false
    return
  }
  
  try {
    const response = await postApi.getPostById(postId)
    
    if (response.success && response.data) {
      post.value = response.data
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

onMounted(() => {
  loadPost()
})
</script>

<template>
  <div class="post-detail-container">
    <Banner />
    
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
            <h3 class="font-bold text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-4 flex items-center gap-2
              before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
              before:absolute before:left-[-16px] before:top-[5.5px]">
              文章标签
            </h3>
            <div class="px-4">
              <div v-if="parsedTags.length > 0" class="flex gap-2 flex-wrap">
                <span
                  v-for="tag in parsedTags"
                  :key="tag"
                  class="bg-[var(--card-bg)] border border-[var(--line-divider)] h-8 text-sm px-3 rounded-lg text-[var(--text-secondary)] flex items-center gap-1"
                >
                  {{ tag }}
                </span>
              </div>
              <div v-else class="text-sm text-[var(--text-tertiary)] py-2">
                暂无标签
              </div>
            </div>
          </div>
          
          <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
            <h3 class="font-bold text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-4 flex items-center gap-2
              before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
              before:absolute before:left-[-16px] before:top-[5.5px]">
              文章分类
            </h3>
            <div class="px-4">
              <div v-if="parsedCategories" class="flex items-center">
                <div class="w-full h-10 rounded-lg bg-[var(--card-hover)] pl-3 flex items-center">
                  <span class="text-sm text-[var(--text-secondary)]">
                    {{ parsedCategories }}
                  </span>
                </div>
              </div>
              <div v-else class="text-sm text-[var(--text-tertiary)] py-2">
                暂无分类
              </div>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-2">
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          </div>
          
          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
          </div>
          
          <article v-else-if="post" class="bg-[var(--card-bg)] rounded-xl shadow-md p-8">
            <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
              {{ post.title }}
            </h1>
            
            <div class="prose prose-lg max-w-none" v-html="renderedContent"></div>
          </article>
        </div>
        
        <div class="lg:col-span-1">
          <SiteStats />
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-detail-container {
  min-height: calc(100vh - 64px);
}

@media (min-width: 1024px) {
  .post-detail-container {
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
