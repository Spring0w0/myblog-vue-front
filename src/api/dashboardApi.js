import apiClient from './client.js'

export const dashboardApi = {
  getArticleNum: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/article-num')
      if (response && response.success && response.data) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取文章总数失败:', error.message)
      return { success: false, data: null, message: '获取文章总数失败' }
    }
  },

  getTagNum: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/tag-num')
      if (response && response.success && response.data) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取标签总数失败:', error.message)
      return { success: false, data: null, message: '获取标签总数失败' }
    }
  },

  getCategoryNum: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/category-num')
      if (response && response.success && response.data) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取分类总数失败:', error.message)
      return { success: false, data: null, message: '获取分类总数失败' }
    }
  },

  getHotArticles: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/hot-article')
      if (response && response.success && Array.isArray(response.data)) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取热度文章失败:', error.message)
      return { success: false, data: [], message: '获取热度文章失败' }
    }
  },

  getRecentArticles: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/recent-article')
      if (response && response.success && Array.isArray(response.data)) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取近期文章失败:', error.message)
      return { success: false, data: [], message: '获取近期文章失败' }
    }
  },

  getDrafts: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/draft')
      if (response && response.success && Array.isArray(response.data)) {
        return response
      }
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取草稿列表失败:', error.message)
      return { success: false, data: [], message: '获取草稿列表失败' }
    }
  }
}
