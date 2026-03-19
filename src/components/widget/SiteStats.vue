<script setup>
import { ref, onMounted } from 'vue'

const runningDays = ref(0)
const lastUpdate = ref(0)

const calculateRunningDays = () => {
  const startDate = new Date('2025-01-01')
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  runningDays.value = diffDays
}

const calculateLastUpdate = () => {
  const lastPostDate = new Date('2025-03-15')
  const today = new Date()
  const diffTime = Math.abs(today - lastPostDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  lastUpdate.value = diffDays
}

onMounted(() => {
  calculateRunningDays()
  calculateLastUpdate()
})
</script>

<template>
  <div class="bg-[var(--card-bg)] rounded-xl shadow-md p-6 mb-6">
    <h3 class="font-bold transition text-lg text-[var(--text-primary)] relative ml-8 mt-4 mb-2 flex items-center gap-2
      before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
      before:absolute before:left-[-16px] before:top-[5.5px]">
      站点统计
    </h3>
    <div class="px-4">
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 17h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm0 0V5z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              文章
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              7
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm0-2h16V8h-8.825l-2-2H4zm0 0V6z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              分类
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              3
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h11q.475 0 .9.213t.7.587L22 12l-5.4 7.2q-.275.375-.7.588T15 20zm0-2h11l4.5-6L15 6H4zm5.5-6"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              标签
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              10
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6zm2-1h12q.425 0 .713-.288T19 16t-.288-.712T18 15H6q-.425 0-.712.288T5 16t.288.713T6 17m0-4h12q.425 0 .713-.288T19 12t-.288-.712T18 11H6q-.425 0-.712.288T5 12t.288.713T6 13m0-4h8q.425 0 .713-.288T15 8t-.288-.712T14 7H6q-.425 0-.712.288T5 8t.288.713T6 9"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              总字数
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]">
              2,330
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 8h14V6H5zm0 0V6zm0 14q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v5.675q-.475-.225-.975-.375T19 11.075V10H5v10h6.3q.175.55.413 1.05t.562.95zm9.463-.462Q13 20.075 13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23t-3.537-1.463m5.212-1.162l.7-.7L18.5 17.8V15h-1v3.2z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              运行天数
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]" data-stat-id="running-days">
              {{ runningDays }}
            </span>
            <span class="text-sm text-[var(--text-tertiary)] ml-1">
              天
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="text-[var(--primary)] text-xl shrink-0">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21q-.45 0-.862-.162t-.738-.488l-6.7-6.725q-.875-.875-1.287-2T2 9.275Q2 6.7 3.675 4.85T7.85 3q1.2 0 2.263.475T12 4.8q.8-.85 1.863-1.325T16.125 3q2.5 0 4.188 1.85T22 9.25q0 1.225-.425 2.35t-1.275 2l-6.725 6.75q-.325.325-.725.488T12 21m1-13q.25 0 .475.125t.35.325l1.7 2.55h4.15q.175-.425.263-.862t.087-.888q-.05-1.725-1.15-2.963t-2.75-1.237q-.775 0-1.487.3t-1.238.875l-.675.725q-.125.15-.325.238t-.4.087t-.4-.087t-.35-.238l-.675-.725q-.525-.575-1.225-.9T7.85 5Q6.2 5 5.1 6.263T4 9.25q0 .45.075.888t.25.862H9q.25 0 .475.125t.35.325l.875 1.3l1.35-4.05q.1-.3.362-.5T13 8m.3 3.25l-1.35 4.05q-.1.3-.375.5t-.6.2q-.25 0-.475-.125t-.35-.325L8.45 13H5.9l5.925 5.925q.05.05.088.063T12 19t.088-.012t.087-.063l5.9-5.925H15q-.25 0-.475-.125t-.375-.325z"></path>
              </svg>
            </div>
            <span class="text-[var(--text-secondary)] font-medium text-sm">
              最后活动
            </span>
          </div>
          <div class="flex items-center ml-3 shrink-0">
            <span class="text-base font-bold text-[var(--text-primary)]" data-stat-id="last-update">
              {{ lastUpdate }}
            </span>
            <span class="text-sm text-[var(--text-tertiary)] ml-1">
              天前
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
