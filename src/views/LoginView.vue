<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref('')
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  // 防御性验证
  if (!password.value || password.value.trim() === '') {
    error.value = '请输入密码'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 由于后端未就绪，暂时使用本地验证
    // 实际项目中应该调用后端验证接口
    // const response = await authApi.login(password.value)
    
    // 模拟验证（实际项目中应该调用后端）
    // 默认密码：admin
    if (password.value === 'admin') {
      // 存储登录状态
      localStorage.setItem('admin_token', 'authenticated')
      // 重定向到管理页面
      router.push('/home/admin')
    } else {
      error.value = '密码错误'
    }
  } catch (err) {
    console.error('登录失败:', err)
    error.value = '登录失败，请稍后重试'
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
          请输入密码访问管理后台
        </p>
      </div>
      
      <!-- 登录表单 -->
      <div class="space-y-6">
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
