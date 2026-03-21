import axios from 'axios'

/**
 * 创建统一的 Axios 实例
 * baseURL 设置为相对路径 /api，支持容器化部署
 */
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 从 localStorage 获取 admin_token 并注入 Authorization Header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一包装返回格式 { success, data, message }
 * 具备极强的防御性，处理各种非预期格式
 */
apiClient.interceptors.response.use(
  (response) => {
    // 如果后端已经返回了标准格式，直接返回
    if (response.data && typeof response.data === 'object') {
      // 如果已经有 success 字段，说明是标准格式
      if ('success' in response.data) {
        return response.data
      }
      // 否则包装成标准格式
      return {
        success: true,
        data: response.data,
        message: '请求成功'
      }
    }
    // 防御性处理：如果返回数据格式异常
    return {
      success: false,
      data: null,
      message: '返回数据格式异常'
    }
  },
  (error) => {
    console.error('API 请求失败:', error)
    
    // 防御性处理：统一错误格式
    let message = '请求失败，请稍后重试'
    
    if (error.response) {
      // 服务器返回了错误状态码
      message = error.response.data?.message || 
                error.response.data?.msg || 
                `服务器错误 (${error.response.status})`
    } else if (error.request) {
      // 请求发送成功但没有收到响应
      message = '网络连接失败，请检查网络'
    } else {
      // 请求配置出错
      message = error.message || '请求配置错误'
    }
    
    return {
      success: false,
      data: null,
      message: message
    }
  }
)

export default apiClient
