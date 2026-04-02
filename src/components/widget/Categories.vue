<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      分类
    </h3>
    <div class="px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-4">
        <svg class="animate-spin h-5 w-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- 分类列表 -->
      <div v-else-if="categories.length > 0">
        <button
          v-for="category in categories"
          :key="category.id || category.name"
          @click="handleCategoryClick(category)"
          :aria-label="`查看所有 ${category.name} 分类的文章`"
          class="
            w-full
            h-10
            rounded-lg
            bg-none
            hover:bg-[var(--card-hover)]
            active:bg-[var(--card-bg)]
            transition-all
            pl-2
            hover:pl-3

            text-sm
            text-[var(--text-secondary)]
            hover:text-[var(--primary)]
          "
          :class="{ 'text-[var(--primary)] bg-[var(--card-hover)]': activeCategoryId === category.id }"
        >
          <div class="flex items-center justify-between relative mr-2">
            <div class="overflow-hidden text-left whitespace-nowrap text-ellipsis">
              {{ category.name }}
            </div>
          </div>
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-sm text-[var(--text-tertiary)] py-4 text-center">
        暂无分类
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryApi } from '../../api/categoryApi.js'

const props = defineProps({
  activeCategoryId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['category-click'])

const categories = ref([])
const loading = ref(true)

const handleCategoryClick = (category) => {
  emit('category-click', category)
}

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await categoryApi.getAllCategories()

    if (response && response.success && Array.isArray(response.data)) {
      categories.value = response.data
    } else {
      console.warn('分类数据格式异常，使用空数组')
      categories.value = []
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    categories.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
</style>
