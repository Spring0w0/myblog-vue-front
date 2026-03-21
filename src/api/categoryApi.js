import apiClient from './client.js'

/**
 * 模拟分类数据（已注释，联调阶段使用真实后端数据）
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
/* const mockCategories = [
  { id: 1, name: '生活', postCount: 3 },
  { id: 2, name: '旅行', postCount: 1 },
  { id: 3, name: '时尚', postCount: 1 },
  { id: 4, name: '娱乐', postCount: 1 }
] */

/**
 * 分类 API 模块
 * 提供分类的增删改查功能
 */
export const categoryApi = {
  /**
   * 获取所有分类
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/categories')
      
      if (response && response.success && Array.isArray(response.data)) {
        return response
      }
      
      console.warn('API 返回异常')
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取分类失败:', error.message)
      return {
        success: false,
        data: [],
        message: '获取分类失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 创建分类
   * @param {string} name - 分类名称
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  createCategory: async (name) => {
    try {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }
      
      const response = await apiClient.post('/categories', { name: name.trim() })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('创建分类失败:', error.message)
      return {
        success: false,
        data: null,
        message: '创建分类失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 删除分类
   * @param {number|string} id - 分类 ID
   * @returns {Promise<{success: boolean, data: null, message: string}>}
   */
  deleteCategory: async (id) => {
    try {
      const categoryId = Number(id)
      if (isNaN(categoryId) || categoryId <= 0) {
        return {
          success: false,
          data: null,
          message: '分类 ID 无效'
        }
      }
      
      const response = await apiClient.delete(`/categories/${categoryId}`)
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('删除分类失败:', error.message)
      return {
        success: false,
        data: null,
        message: '删除分类失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 根据分类获取文章
   * @param {string} categoryName - 分类名称
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @returns {Promise<{success: boolean, data: {posts: Array, total: number, page: number, limit: number, totalPages: number}, message: string}>}
   */
  getPostsByCategory: async (categoryName, page = 1, limit = 6) => {
    try {
      if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }
      
      const response = await apiClient.get(`/categories/${encodeURIComponent(categoryName.trim())}/posts`, {
        params: { page, limit }
      })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取分类文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取分类文章失败，请检查后端服务是否启动'
      }
    }
  }
}
