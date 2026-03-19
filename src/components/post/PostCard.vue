<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => {
  if (!props.post.createdAt) return ''
  const date = new Date(props.post.createdAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})

const truncatedSummary = computed(() => {
  if (!props.post.summary) return ''
  return props.post.summary.length > 100 
    ? props.post.summary.substring(0, 100) + '...' 
    : props.post.summary
})
</script>

<template>
  <article class="post-card group">
    <div class="relative overflow-hidden rounded-xl bg-[var(--card-bg)] shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]">
      <!-- 封面图 -->
      <div v-if="post.cover" class="relative aspect-[16/9] overflow-hidden">
        <img 
          :src="post.cover" 
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <!-- 文章内容 -->
      <div class="p-6">
        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in post.tags" 
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- 标题 -->
        <h3 class="mb-3 text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors duration-300">
          <router-link :to="`/home/post/${post.id}`">
            {{ post.title }}
          </router-link>
        </h3>
        
        <!-- 摘要 -->
        <p v-if="post.summary" class="mb-4 text-sm text-[var(--text-secondary)] line-clamp-2">
          {{ truncatedSummary }}
        </p>
        
        <!-- 底部信息 -->
        <div class="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formattedDate }}
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            {{ post.readTime || 5 }} 分钟
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
