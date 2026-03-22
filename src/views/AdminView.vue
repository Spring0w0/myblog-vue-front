<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postApi } from '../api/postApi'
import { tagApi } from '../api/tagApi'
import { categoryApi } from '../api/categoryApi'

const router = useRouter()
const posts = ref([])
const tags = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref('')
const showAddTagDialog = ref(false)
const showAddCategoryDialog = ref(false)
const showProfileDialog = ref(false)
const showAnnouncementDialog = ref(false)
const newTagName = ref('')
const newCategoryName = ref('')

// 个人信息数据
const profile = ref({
  avatar: '/assets/images/avatar.webp',
  name: 'Mizuki',
  description: 'One demo website'
})

// 公告数据
const announcement = ref({
  content: 'ブログへようこそ！これはサンプルの告知です'
})

// 编辑表单数据
const editProfile = ref({ ...profile.value })
const editAnnouncement = ref({ ...announcement.value })

// 初始化数据
const initData = () => {
  // 从localStorage读取个人信息
  const savedProfile = localStorage.getItem('blog_profile')
  if (savedProfile) {
    try {
      profile.value = JSON.parse(savedProfile)
      editProfile.value = { ...profile.value }
    } catch (error) {
      console.error('读取个人信息失败:', error)
    }
  }
  
  // 从localStorage读取公告
  const savedAnnouncement = localStorage.getItem('blog_announcement')
  if (savedAnnouncement) {
    try {
      announcement.value = JSON.parse(savedAnnouncement)
      editAnnouncement.value = { ...announcement.value }
    } catch (error) {
      console.error('读取公告失败:', error)
    }
  }
}

// 保存个人信息
const saveProfile = () => {
  profile.value = { ...editProfile.value }
  localStorage.setItem('blog_profile', JSON.stringify(profile.value))
  showProfileDialog.value = false
  alert('个人信息更新成功')
}

// 保存公告
const saveAnnouncement = () => {
  announcement.value = { ...editAnnouncement.value }
  localStorage.setItem('blog_announcement', JSON.stringify(announcement.value))
  showAnnouncementDialog.value = false
  alert('公告更新成功')
}

// 显示个人信息编辑对话框
const handleShowProfileDialog = () => {
  editProfile.value = { ...profile.value }
  showProfileDialog.value = true
}

// 显示公告编辑对话框
const handleShowAnnouncementDialog = () => {
  editAnnouncement.value = { ...announcement.value }
  showAnnouncementDialog.value = true
}

// 登出功能
const handleLogout = () => {
  localStorage.removeItem('admin_token')
  router.push('/login')
}

// 新增文章
const handleAddPost = () => {
  router.push('/admin/post/edit')
}

// 编辑文章
const handleEditPost = (id) => {
  router.push(`/admin/post/edit/${id}`)
}

// 删除文章
const handleDeletePost = async (id, event) => {
  event.stopPropagation()
  if (window.confirm('请确认是否删除该文章？')) {
    try {
      const response = await postApi.deletePost(id)
      if (response.success) {
        fetchPosts()
        alert('删除成功')
      } else {
        alert('删除失败: ' + response.message)
      }
    } catch (err) {
      console.error('删除文章失败:', err)
      alert('删除失败，请稍后重试')
    }
  }
}

// 删除标签
const handleDeleteTag = async (id, event) => {
  event.stopPropagation()
  if (window.confirm('请确认是否删除该标签？')) {
    try {
      const response = await tagApi.deleteTag(id)
      if (response.success) {
        fetchTags()
        alert('删除成功')
      } else {
        alert('删除失败: ' + response.message)
      }
    } catch (err) {
      console.error('删除标签失败:', err)
      alert('删除失败，请稍后重试')
    }
  }
}

// 删除分类
const handleDeleteCategory = async (id, event) => {
  event.stopPropagation()
  if (window.confirm('请确认是否删除该分类？')) {
    try {
      const response = await categoryApi.deleteCategory(id)
      if (response.success) {
        fetchCategories()
        alert('删除成功')
      } else {
        alert('删除失败: ' + response.message)
      }
    } catch (err) {
      console.error('删除分类失败:', err)
      alert('删除失败，请稍后重试')
    }
  }
}

// 显示新增标签对话框
const handleShowAddTagDialog = () => {
  showAddTagDialog.value = true
  newTagName.value = ''
}

// 显示新增分类对话框
const handleShowAddCategoryDialog = () => {
  showAddCategoryDialog.value = true
  newCategoryName.value = ''
}

// 新增标签
const handleAddTag = async () => {
  if (!newTagName.value.trim()) {
    alert('标签名称不能为空')
    return
  }
  
  try {
    const response = await tagApi.createTag(newTagName.value.trim())
    if (response.success) {
      showAddTagDialog.value = false
      fetchTags()
      alert('新增成功')
    } else {
      alert('新增失败: ' + response.message)
    }
  } catch (err) {
    console.error('新增标签失败:', err)
    alert('新增失败，请稍后重试')
  }
}

// 新增分类
const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) {
    alert('分类名称不能为空')
    return
  }
  
  try {
    const response = await categoryApi.createCategory(newCategoryName.value.trim())
    if (response.success) {
      showAddCategoryDialog.value = false
      fetchCategories()
      alert('新增成功')
    } else {
      alert('新增失败: ' + response.message)
    }
  } catch (err) {
    console.error('新增分类失败:', err)
    alert('新增失败，请稍后重试')
  }
}

// 获取文章列表
const fetchPosts = async () => {
  try {
    const response = await postApi.getPosts()
    if (response.success && response.data && Array.isArray(response.data.posts)) {
      posts.value = response.data.posts
    } else {
      posts.value = []
    }
  } catch (err) {
    error.value = '获取文章列表失败'
    console.error('获取文章列表失败:', err)
    posts.value = []
  } finally {
    loading.value = false
  }
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const response = await tagApi.getAllTags()
    if (response.success && response.data) {
      tags.value = response.data
    }
  } catch (err) {
    console.error('获取标签列表失败:', err)
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await categoryApi.getAllCategories()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    console.error('获取分类列表失败:', err)
  }
}

onMounted(() => {
  initData()
  fetchPosts()
  fetchTags()
  fetchCategories()
})</script>

<template>
  <div class="min-h-screen bg-[var(--page-bg)]">
    <!-- 导航栏 -->
    <nav class="bg-[var(--card-bg)] border-b border-[var(--line-divider)]">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-[var(--text-primary)]">MizukiBlog 管理后台</h1>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="handleAddPost"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            新增文章
          </button>
          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            登出
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 侧边栏 -->
        <div class="lg:w-1/4">
          <div class="bg-[var(--card-bg)] rounded-xl p-4 shadow-md">
            <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4">管理工具</h2>
            
            <!-- 个人信息管理 -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-[var(--text-secondary)] mb-2">个人信息管理</h3>
              <div class="bg-gray-100 rounded-lg p-4 mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden">
                    <img :src="profile.avatar" alt="头像" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <h4 class="font-medium">{{ profile.name }}</h4>
                    <p class="text-sm text-gray-500">{{ profile.description }}</p>
                  </div>
                </div>
              </div>
              <button @click="handleShowProfileDialog" class="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                编辑个人信息
              </button>
            </div>

            <!-- 公告管理 -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-[var(--text-secondary)] mb-2">公告管理</h3>
              <div class="bg-gray-100 rounded-lg p-4 mb-3">
                <p class="text-sm text-gray-600">{{ announcement.content }}</p>
              </div>
              <button @click="handleShowAnnouncementDialog" class="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                编辑公告
              </button>
            </div>
            
            <!-- 标签管理 -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-[var(--text-secondary)] mb-2">标签管理</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in tags" 
                  :key="tag.id"
                  class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {{ tag.name }} ({{ tag.count }})
                  <button @click="handleDeleteTag(tag.id, $event)" class="ml-2 text-red-500 hover:text-red-700">×</button>
                </span>
              </div>
              <button @click="handleShowAddTagDialog" class="mt-3 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                新增标签
              </button>
            </div>

            <!-- 分类管理 -->
            <div>
              <h3 class="text-md font-medium text-[var(--text-secondary)] mb-2">分类管理</h3>
              <ul class="space-y-2">
                <li 
                  v-for="category in categories" 
                  :key="category.id"
                  class="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-lg"
                >
                  <span>{{ category.name }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">{{ category.count }} 篇</span>
                    <button @click="handleDeleteCategory(category.id, $event)" class="text-red-500 hover:text-red-700">×</button>
                  </div>
                </li>
              </ul>
              <button @click="handleShowAddCategoryDialog" class="mt-3 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                新增分类
              </button>
            </div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="lg:w-3/4">
          <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-md">
            <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4">文章管理</h2>
            
            <div v-if="loading" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
            
            <div v-else-if="error" class="py-10 text-center text-red-500">
              {{ error }}
            </div>
            
            <div v-else-if="posts.length === 0" class="py-10 text-center text-gray-500">
              暂无文章
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="post in posts" 
                :key="post.id"
                class="border border-[var(--line-divider)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                @click="handleEditPost(post.id)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-medium text-[var(--text-primary)]">{{ post.title }}</h3>
                  <span 
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ post.status === 'PUBLISHED' ? '已发布' : '草稿' }}
                  </span>
                </div>
                <p class="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{{ post.summary }}</p>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    v-for="tag in (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) : post.tags)" 
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-xs text-[var(--text-tertiary)]">
                  <span>{{ post.updateAt || post.createAt }}</span>
                  <div class="flex gap-2">
                    <button 
                      @click.stop="handleEditPost(post.id)"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      编辑
                    </button>
                    <button @click="handleDeletePost(post.id, $event)" class="text-red-500 hover:text-red-700">
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人信息编辑对话框 -->
    <div v-if="showProfileDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">编辑个人信息</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">头像 URL</label>
            <input v-model="editProfile.avatar" type="text" class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)]">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">名称</label>
            <input v-model="editProfile.name" type="text" class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)]">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">描述</label>
            <input v-model="editProfile.description" type="text" class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)]">
          </div>
        </div>
        
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showProfileDialog = false" class="px-4 py-2 border border-[var(--line-divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors">
            取消
          </button>
          <button @click="saveProfile" class="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-colors">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 公告编辑对话框 -->
    <div v-if="showAnnouncementDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-4">编辑公告</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">公告内容</label>
            <textarea v-model="editAnnouncement.content" rows="4" class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)]"></textarea>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showAnnouncementDialog = false" class="px-4 py-2 border border-[var(--line-divider)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors">
            取消
          </button>
          <button @click="saveAnnouncement" class="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-colors">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与项目一致的样式风格 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
