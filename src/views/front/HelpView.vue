<script setup>
import Banner from '../../components/common/Banner.vue'
import SiteStats from '../../components/widget/SiteStats.vue'
import Calendar from '../../components/widget/Calendar.vue'
import Announcement from '../../components/widget/Announcement.vue'
import Tags from '../../components/widget/Tags.vue'
import Categories from '../../components/widget/Categories.vue'
import ProfileCard from '../../components/widget/ProfileCard.vue'
</script>

<template>
  <div class="help-container">
    <!-- Banner -->
    <Banner />
    
    <!-- 主内容区域 -->
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧边栏 -->
        <div class="lg:col-span-1">
          <!-- 个人信息卡片 -->
          <ProfileCard />

          <!-- 公告 -->
          <Announcement />
          
          <!-- 标签 -->
          <Tags />

          <!-- 分类 -->
          <Categories />
        </div>
        
        <!-- 中间 - 帮助内容 -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">帮助</h2>
            <div class="h-1 w-20 bg-[var(--primary)] rounded-full"></div>
          </div>
          
          <!-- 帮助卡片 -->
          <div class="card-base p-8">
            <p class="text-[var(--text-secondary)]">我还不知道这里该写什么</p>
          </div>
        </div>
        
        <!-- 右侧边栏 -->
        <div class="lg:col-span-1">
          <SiteStats />
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
}

@media (min-width: 1024px) {
  .help-container {
    padding-bottom: 4rem;
  }
}
</style>
