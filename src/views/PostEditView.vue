<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { postApi } from '../api/postApi'
import { tagApi } from '../api/tagApi'
import { categoryApi } from '../api/categoryApi'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const router = useRouter()
const route = useRoute()
const postId = route.params.id

const title = ref('')
const summary = ref('')
const cover = ref('')
const tags = ref([])
const categories = ref([])
const selectedTags = ref([])
const selectedCategory = ref('')
const status = ref('PUBLISHED')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const vditorElement = ref(null)
let vditor = null

// 初始化 Vditor 编辑器
const initVditor = () => {
  if (vditorElement.value && !vditor) {
    vditor = new Vditor(vditorElement.value, {
      mode: 'ir', // 即时渲染模式
      height: 600,
      outline: { enable: false },
      cache: { enable: false },
      upload: {
        handler: async (files) => {
          const file = files[0]
          if (!file) return
          
          try {
            const formData = new FormData()
            formData.append('file', file)
            
            const response = await postApi.uploadImage(formData)
            
            if (response.success && response.data) {
              return {
                success: 1,
                data: {
                  url: response.data
                }
              }
            } else {
              return {
                success: 0,
                message: response.message || '上传失败'
              }
            }
          } catch (err) {
            console.error('上传图片失败:', err)
            return {
              success: 0,
              message: '上传失败，请稍后重试'
            }
          }
        }
      }
    })
  }
}

// 获取文章详情
const fetchPostDetail = async () => {
  if (!postId) return
  
  loading.value = true
  
  try {
    const response = await postApi.getPostById(postId)
    if (response.success && response.data) {
      const post = response.data
      title.value = post.title
      summary.value = post.summary
      cover.value = post.cover
      selectedTags.value = post.tags ? post.tags.split(',') : []
      selectedCategory.value = post.categories || ''
      status.value = post.status
      
      // 初始化 Vditor 并设置内容
      initVditor()
      if (vditor) {
        vditor.setValue(post.content || '')
      }
    }
  } catch (err) {
    error.value = '获取文章详情失败'
    console.error('获取文章详情失败:', err)
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

// 保存文章
const savePost = async () => {
  if (!title.value.trim()) {
    error.value = '请输入文章标题'
    return
  }
  
  saving.value = true
  error.value = ''
  
  try {
    // 从 Vditor 获取内容
    const content = vditor ? vditor.getValue() : ''
    
    // 转换标签和分类格式
    const tagsStr = selectedTags.value.join(',')
    const categoriesStr = selectedCategory.value
    
    const postData = {
      title: title.value,
      summary: summary.value,
      content: content,
      cover: cover.value,
      tags: tagsStr,
      categories: categoriesStr,
      status: status.value
    }
    
    let response
    if (postId) {
      response = await postApi.updatePost(postId, postData)
    } else {
      response = await postApi.createPost(postData)
    }
    
    if (response.success) {
      router.push('/admin')
    } else {
      error.value = response.message || '保存失败'
    }
  } catch (err) {
    error.value = '保存失败，请稍后重试'
    console.error('保存文章失败:', err)
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  router.push('/admin')
}

// 处理标签选择
const toggleTag = (tagName) => {
  const index = selectedTags.value.indexOf(tagName)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagName)
  }
}

// 组件挂载后初始化
onMounted(() => {
  fetchTags()
  fetchCategories()
  fetchPostDetail()
  
  // 对于新文章，也需要初始化 Vditor
  if (!postId) {
    setTimeout(() => {
      initVditor()
    }, 100)
  }
})

// 组件销毁前清理
onBeforeUnmount(() => {
  if (vditor) {
    vditor.destroy()
    vditor = null
  }
})
</script>

<template>
  <div class="min-h-screen bg-[var(--page-bg)]">
    <!-- 导航栏 -->
    <nav class="bg-[var(--card-bg)] border-b border-[var(--line-divider)]">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button 
            @click="cancelEdit"
            class="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            ← 返回管理页
          </button>
          <h1 class="text-xl font-bold text-[var(--text-primary)]">
            {{ postId ? '编辑文章' : '新增文章' }}
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="savePost"
            :disabled="saving"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 编辑表单 -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 侧边栏 - 表单字段 -->
        <div class="lg:w-1/4">
          <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-md h-full">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-6">文章设置</h3>
            
            <!-- 错误提示 -->
            <div v-if="error" class="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {{ error }}
            </div>
            
            <!-- 标题输入 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                标题
              </label>
              <input
                v-model="title"
                type="text"
                placeholder="请输入文章标题"
                class="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
              />
            </div>
            
            <!-- 摘要输入 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                摘要
              </label>
              <textarea
                v-model="summary"
                placeholder="请输入文章摘要"
                rows="3"
                class="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors resize-none"
              ></textarea>
            </div>
            
            <!-- 封面图片 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                封面图片
              </label>
              <div class="flex items-center gap-4">
                <input
                  v-model="cover"
                  type="text"
                  placeholder="封面图片路径"
                  class="flex-1 px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                />
                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  上传
                </button>
              </div>
            </div>
            
            <!-- 标签选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                标签
              </label>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in tags" 
                  :key="tag.id"
                  :class="[
                    'px-3 py-1 rounded-full text-sm cursor-pointer transition-colors',
                    selectedTags.includes(tag.name) 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                  @click="toggleTag(tag.name)"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
            
            <!-- 分类选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                分类
              </label>
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
              >
                <option value="">请选择分类</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id"
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- 状态选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                状态
              </label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="status"
                    type="radio"
                    value="PUBLISHED"
                    class="text-[var(--primary)]"
                  />
                  <span>已发布</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="status"
                    type="radio"
                    value="DRAFT"
                    class="text-[var(--primary)]"
                  />
                  <span>草稿</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 中间和右侧 - 富文本编辑器 -->
        <div class="lg:w-3/4">
          <div class="bg-[var(--card-bg)] rounded-xl p-6 shadow-md h-full flex flex-col">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] mb-6">文章内容</h3>
            
            <div v-if="loading" class="flex justify-center py-20 flex-1">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
            
            <div v-else class="flex-1 flex flex-col">
              <!-- Vditor 编辑器 -->
              <div class="flex-1 border border-[var(--line-divider)] rounded-lg overflow-hidden">
                <div ref="vditorElement"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与项目一致的样式风格 */
</style>
