<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      分类
    </h3>
    <div class="px-4">
      <a 
        v-for="category in categories" 
        :key="category.name"
        :href="`/archive/?category=${category.name}`"
        :aria-label="`View all posts in the ${category.name} category`"
        class="block"
      >
        <button class="
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
        ">
          <div class="flex items-center justify-between relative mr-2">
            <div class="overflow-hidden text-left whitespace-nowrap text-ellipsis">
              {{ category.name }}
            </div>
            <div class="transition px-2 h-7 ml-4 min-w-8 rounded-lg text-sm font-bold
              text-[var(--text-secondary)]
              bg-[var(--card-hover)]
              flex items-center justify-center">
              {{ category.count }}
            </div>
          </div>
        </button>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  { name: 'Examples', count: 5 },
  { name: 'Guides', count: 1 },
  { name: 'Technology', count: 1 }
])
</script>

<style scoped>
</style>