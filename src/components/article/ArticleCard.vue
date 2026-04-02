<script setup>
import { computed } from 'vue'
import { getCoverUrl } from '../../utils/imageHelper.js'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => {
  const dateStr = props.article.updateTime
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
    console.warn('日期格式化失败:', dateStr)
    return ''
  }
})

const truncatedSummary = computed(() => {
  if (!props.article.summary || typeof props.article.summary !== 'string') return ''

  const summary = props.article.summary.trim()
  if (summary.length > 100) {
    return summary.substring(0, 100) + '...'
  }
  return summary
})

const coverUrl = computed(() => {
  return getCoverUrl(props.article.cover, props.article.id)
})

const parsedTags = computed(() => {
  const tags = props.article.tag

  if (Array.isArray(tags)) {
    return tags
      .filter(tag => tag && tag.name)
      .map(tag => tag.name)
  }

  return []
})

const categoryName = computed(() => {
  const category = props.article.category
  if (category && category.name) {
    return category.name
  }
  return ''
})
</script>

<template>
  <article class="post-card group">
    <div class="relative overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]">
      <!-- 封面图 -->
      <div class="relative aspect-[16/9] overflow-hidden">
        <img 
          :src="coverUrl" 
          :alt="article.title || '文章封面'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          @error="$event.target.src = '/default-covers/1.webp'"
        />
      </div>
      
      <!-- 文章内容 -->
      <div class="p-6">
        <!-- 标签 -->
        <div v-if="parsedTags.length > 0" class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="tag in parsedTags"
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 分类 -->
        <div v-if="categoryName" class="mb-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)] text-white">
            {{ categoryName }}
          </span>
        </div>
        
        <!-- 标题 -->
        <h3 class="mb-3 text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1">
          <router-link :to="`/article/${article.id}`">
            {{ article.title || '无标题' }}
          </router-link>
        </h3>
        
        <!-- 摘要 -->
        <p v-if="truncatedSummary" class="mb-4 text-sm text-[var(--text-secondary)] line-clamp-2">
          {{ truncatedSummary }}
        </p>
        
        <!-- 底部信息 -->
        <div class="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span v-if="formattedDate" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formattedDate }}
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
