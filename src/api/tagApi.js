import apiClient from './client.js'

/**
 * 模拟标签数据（已注释，联调阶段使用真实后端数据）
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
/* const mockTags = [
  { id: 1, name: '生活', postCount: 3 },
  { id: 2, name: '摄影', postCount: 1 },
  { id: 3, name: '樱花', postCount: 1 },
  { id: 4, name: '旅行', postCount: 1 },
  { id: 5, name: '日本', postCount: 1 },
  { id: 6, name: '美食', postCount: 2 },
  { id: 7, name: '时尚', postCount: 1 },
  { id: 8, name: '穿搭', postCount: 1 },
  { id: 9, name: '春季', postCount: 1 },
  { id: 10, name: '咖啡', postCount: 1 },
  { id: 11, name: '电影', postCount: 1 },
  { id: 12, name: '推荐', postCount: 1 },
  { id: 13, name: '春天', postCount: 1 },
  { id: 14, name: '植物', postCount: 1 },
  { id: 15, name: '养护', postCount: 1 }
] */

/**
 * 标签 API 模块
 * 提供标签的增删改查功能
 */
export const tagApi = {
  /**
   * 获取所有标签
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getAllTags: async () => {
    try {
      const response = await apiClient.get('/tags')
      
      if (response && response.success && Array.isArray(response.data)) {
        return response
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
   * @returns {Promise<{success: boolean, data: {posts: Array, total: number, page: number, limit: number, totalPages: number}, message: string}>}
   */
  getPostsByTag: async (tagName, page = 1, limit = 6) => {
    try {
      if (!tagName || typeof tagName !== 'string' || tagName.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }
      
      const response = await apiClient.get(`/tags/${encodeURIComponent(tagName.trim())}/posts`, {
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
