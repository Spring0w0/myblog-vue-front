<script setup>
import { computed } from 'vue'
import { getCoverUrl, parseTags } from '../../utils/imageHelper.js'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

/**
 * 格式化日期
 * 防御性处理：支持 createdAt 和 createAt 两种字段名
 */
const formattedDate = computed(() => {
  // 优先使用 createAt（后端字段），其次使用 createdAt（前端旧字段）
  const dateStr = props.post.createAt || props.post.createdAt
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    // 检查日期是否有效
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    console.warn('日期格式化失败:', dateStr)
    return ''
  }
})

/**
 * 截断摘要
 * 防御性处理：确保摘要不会撑破容器
 */
const truncatedSummary = computed(() => {
  if (!props.post.summary || typeof props.post.summary !== 'string') return ''
  
  const summary = props.post.summary.trim()
  if (summary.length > 100) {
    return summary.substring(0, 100) + '...'
  }
  return summary
})

/**
 * 封面图片 URL
 * 使用工具函数处理默认封面轮换逻辑
 */
const coverUrl = computed(() => {
  return getCoverUrl(props.post.cover, props.post.id)
})

/**
 * 解析标签
 * 从逗号分隔字符串转换为数组
 * 防御性处理：支持字符串和数组两种格式
 */
const parsedTags = computed(() => {
  const tags = props.post.tags
  
  // 如果是数组，直接返回
  if (Array.isArray(tags)) {
    return tags.filter(tag => tag && String(tag).trim() !== '')
  }
  
  // 如果是字符串，使用工具函数解析
  if (typeof tags === 'string') {
    return parseTags(tags)
  }
  
  // 其他情况返回空数组
  return []
})

/**
 * 格式化更新时间
 * 防御性处理：支持 updateAt 和 updatedAt 两种字段名
 */
const formattedUpdateTime = computed(() => {
  const dateStr = props.post.updateAt || props.post.updatedAt
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    return ''
  }
})
</script>

<template>
  <article class="post-card group">
    <div class="relative overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]">
      <!-- 封面图 -->
      <div class="relative aspect-[16/9] overflow-hidden">
        <img 
          :src="coverUrl" 
          :alt="post.title || '文章封面'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          @error="$event.target.src = '/uploads/covers/default/1.webp'"
        />
      </div>
      
      <!-- 文章内容 -->
      <div class="p-6">
        <!-- 标签 -->
        <div v-if="parsedTags.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in parsedTags" 
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- 标题 -->
        <h3 class="mb-3 text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1">
          <router-link :to="`/home/post/${post.id}`">
            {{ post.title || '无标题' }}
          </router-link>
        </h3>
        
        <!-- 摘要 -->
        <p v-if="truncatedSummary" class="mb-4 text-sm text-[var(--text-secondary)] line-clamp-2">
          {{ truncatedSummary }}
        </p>
        
        <!-- 底部信息 -->
        <div class="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <!-- 发布时间 -->
          <span v-if="formattedDate" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formattedDate }}
          </span>
          
          <!-- 更新时间（新增） -->
          <span v-if="formattedUpdateTime && formattedUpdateTime !== formattedDate" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            更新于 {{ formattedUpdateTime }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  animation: fadeInUp 0.6s ease-out;
  margin-bottom: 1.5rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
