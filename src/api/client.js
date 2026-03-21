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
 * 适配后端格式 { code, msg, data }
 */
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      const backendData = response.data
      
      if ('success' in backendData) {
        return backendData
      }
      
      if ('code' in backendData && 'msg' in backendData) {
        return {
          success: backendData.code === 200,
          data: backendData.data,
          message: backendData.msg
        }
      }
      
      return {
        success: true,
        data: backendData,
        message: '请求成功'
      }
    }
    return {
      success: false,
      data: null,
      message: '返回数据格式异常'
    }
  },
  (error) => {
    console.error('API 请求失败:', error)
    
    let message = '请求失败，请稍后重试'
    
    if (error.response) {
      message = error.response.data?.message || 
                error.response.data?.msg || 
                `服务器错误 (${error.response.status})`
    } else if (error.request) {
      message = '网络连接失败，请检查网络'
    } else {
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
