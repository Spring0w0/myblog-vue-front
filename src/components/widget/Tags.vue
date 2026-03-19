<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      标签
    </h3>
    <div class="px-4">
      <div class="flex gap-2 flex-wrap">
        <a 
          v-for="tag in tags" 
          :key="tag.name"
          :href="`/archive/?tag=${tag.name}`"
          :aria-label="`View all posts with the ${tag.name} tag`"
          class="bg-[var(--card-bg)] border border-[var(--line-divider)] h-8 text-sm px-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)] transition-all"
        >
          {{ tag.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tags = ref([
  { name: 'Blogging', count: 1 },
  { name: 'Customization', count: 1 },
  { name: 'Demo', count: 1 },
  { name: 'Encryption', count: 1 },
  { name: 'Example', count: 1 },
  { name: 'Markdown', count: 1 },
  { name: 'Mermaid', count: 1 },
  { name: 'Mizuki', count: 1 },
  { name: 'Test', count: 1 },
  { name: 'Video', count: 1 }
])
</script>

<style scoped>
</style>