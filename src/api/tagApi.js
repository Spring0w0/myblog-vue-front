import apiClient from './client.js'

export const tagApi = {
  getAllTags: async () => {
    try {
      const response = await apiClient.get('/tag/page', {
        params: { page: 1, pageSize: 100 }
      })

      if (response && response.success && response.data) {
        return {
          success: true,
          data: response.data.list || [],
          message: response.message || '获取标签成功'
        }
      }

      console.warn('API 返回异常')
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取标签失败:', error.message)
      return {
        success: false,
        data: [],
        message: '获取标签失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 创建标签
   * @param {string} name - 标签名称
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  createTag: async (name) => {
    try {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }
      
      const response = await apiClient.post('/tags', { name: name.trim() })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('创建标签失败:', error.message)
      return {
        success: false,
        data: null,
        message: '创建标签失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 删除标签
   * @param {number|string} id - 标签 ID
   * @returns {Promise<{success: boolean, data: null, message: string}>}
   */
  deleteTag: async (id) => {
    try {
      const tagId = Number(id)
      if (isNaN(tagId) || tagId <= 0) {
        return {
          success: false,
          data: null,
          message: '标签 ID 无效'
        }
      }
      
      const response = await apiClient.delete(`/tags/${tagId}`)
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('删除标签失败:', error.message)
      return {
        success: false,
        data: null,
        message: '删除标签失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 根据标签获取文章
   * @param {string} tagName - 标签名称
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @returns {Promise<{success: boolean, data: {articles: Array, total: number, page: number, limit: number, totalPages: number}, message: string}>}
   */
  getArticlesByTag: async (tagName, page = 1, pageSize = 10) => {
    try {
      if (!tagName || typeof tagName !== 'string' || tagName.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }
      
      const response = await apiClient.get(`/tags/${encodeURIComponent(tagName.trim())}/articles`, {
        params: { page, limit }
      })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取标签文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取标签文章失败，请检查后端服务是否启动'
      }
    }
  }
}
