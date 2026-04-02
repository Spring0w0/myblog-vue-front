<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '../../api/authApi'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  // 防御性验证
  if (!username.value || username.value.trim() === '') {
    error.value = '请输入用户名'
    return
  }
  if (!password.value || password.value.trim() === '') {
    error.value = '请输入密码'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 调用后端登录接口
    const response = await authApi.login(username.value, password.value)
    
    console.log('登录响应:', response)
    
    if (response.success && response.data) {
      // 存储登录状态到Cookie
      document.cookie = `admin_token=${response.data.token}; path=/; SameSite=Strict`
      console.log('Cookie设置成功')
      // 重定向到管理页面
      router.push('/admin')
      console.log('跳转成功')
    } else {
      error.value = response.message || '登录失败'
      console.log('登录失败:', response.message)
    }
  } catch (err) {
    console.error('登录失败:', err)
    error.value = err.message || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 回车键登录
const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
    <div class="w-full max-w-md p-8 bg-[var(--card-bg)] rounded-xl shadow-lg">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
          管理员登录
        </h1>
        <p class="text-sm text-[var(--text-secondary)]">
          请输入用户名和密码访问管理后台
        </p>
      </div>
      
      <!-- 登录表单 -->
      <div class="space-y-6">
        <!-- 用户名输入 -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            用户名
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
            @keydown="handleKeydown"
          />
        </div>
        
        <!-- 密码输入 -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            密码
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--line-divider)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
            @keydown="handleKeydown"
          />
        </div>
        
        <!-- 错误提示 -->
        <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {{ error }}
        </div>
        
        <!-- 登录按钮 -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full py-3 px-4 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登录中...
          </span>
          <span v-else>登录</span>
        </button>
        
        <!-- 返回首页 -->
        <div class="text-center">
          <router-link
            to="/"
            class="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            ← 返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与项目一致的样式风格 */
</style>
