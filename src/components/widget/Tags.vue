<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      标签
    </h3>
    <div class="px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-4">
        <svg class="animate-spin h-5 w-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- 标签列表 -->
      <div v-else-if="tags.length > 0" class="flex gap-2 flex-wrap">
        <button
          v-for="tag in tags"
          :key="tag.id || tag.name"
          @click="handleTagClick(tag)"
          :aria-label="`查看所有 ${tag.name} 标签的文章`"
          class="bg-[var(--card-bg)] border border-[var(--line-divider)] h-8 text-sm px-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] transition-all flex items-center gap-1"
          :class="{ 'bg-[var(--primary)] text-white border-[var(--primary)]': isTagActive(tag.id) }"
        >
          {{ tag.name }}
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-sm text-[var(--text-tertiary)] py-4 text-center">
        暂无标签
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tagApi } from '../../api/tagApi.js'

const props = defineProps({
  activeTagIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['tag-click'])

const tags = ref([])
const loading = ref(true)

const handleTagClick = (tag) => {
  emit('tag-click', tag)
}

const isTagActive = (tagId) => {
  return props.activeTagIds.includes(tagId)
}

const loadTags = async () => {
  loading.value = true
  try {
    const response = await tagApi.getAllTags()

    if (response && response.success && Array.isArray(response.data)) {
      tags.value = response.data
    } else {
      console.warn('标签数据格式异常，使用空数组')
      tags.value = []
    }
  } catch (error) {
    console.error('加载标签失败:', error)
    tags.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTags()
})
</script>

<style scoped>
</style>
