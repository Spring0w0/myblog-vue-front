<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      日历
    </h3>
    <div class="px-4">
      <div class="flex justify-between items-center mb-4">
        <button @click="prevMonth" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </svg>
        </button>
        <h4 class="text-[var(--text-primary)] font-medium">{{ currentYearMonth }}</h4>
        <button @click="nextMonth" class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center">
        <div v-for="day in weekDays" :key="day" class="text-sm text-[var(--text-secondary)] py-2">
          {{ day }}
        </div>
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="aspect-square flex items-center justify-center text-sm"
          :class="{
            'text-[var(--text-tertiary)]': day.month !== currentMonth,
            'text-[var(--text-primary)]': day.month === currentMonth && day.date !== today,
            'bg-[var(--primary)] text-white rounded-full': day.date === today
          }"
        >
          {{ day.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentDate = ref(new Date())
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYearMonth = computed(() => `${currentYear.value}年${currentMonth.value + 1}月`)

const today = computed(() => {
  const now = new Date()
  return now.getDate()
})

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  for (let i = 0; i < 42; i++) { // 6 rows * 7 days
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push({
      date: date.getDate(),
      month: date.getMonth()
    })
  }
  
  return days
})

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

onMounted(() => {
  // 初始化日历
})
</script>

<style scoped>
/* 日历组件样式 */
</style>