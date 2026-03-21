import apiClient from './client.js'

/**
 * 模拟分类数据
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
const mockCategories = [
  { id: 1, name: '生活', postCount: 3 },
  { id: 2, name: '旅行', postCount: 1 },
  { id: 3, name: '时尚', postCount: 1 },
  { id: 4, name: '娱乐', postCount: 1 }
]

/**
 * 分类 API 模块
 * 提供分类的增删改查功能
 * 由于后端未就绪，暂时保留 Mock 数据作为 Fallback
 */
export const categoryApi = {
  /**
   * 获取所有分类
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getAllCategories: async () => {
    try {
      // 尝试调用真实 API
      const response = await apiClient.get('/categories')
      
      // 防御性处理：检查返回格式
      if (response && response.success && Array.isArray(response.data)) {
        return response
      }
      
      // 如果 API 返回异常，使用 Mock 数据作为 Fallback
      console.warn('API 返回异常，使用 Mock 数据')
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('使用 Mock 数据:', error.message)
      
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return {
        success: true,
        data: mockCategories,
        message: '获取成功（Mock 数据）'
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
      // 防御性处理：检查数据
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.post('/categories', { name: name.trim() })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('创建分类失败:', error.message)
      
      // Mock 实现：模拟创建成功
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // 检查是否已存在
      const existingCategory = mockCategories.find(c => c.name === name.trim())
      if (existingCategory) {
        return {
          success: false,
          data: null,
          message: '分类已存在'
        }
      }
      
      const newCategory = {
        id: mockCategories.length + 1,
        name: name.trim(),
        postCount: 0
      }
      
      mockCategories.push(newCategory)
      
      return {
        success: true,
        data: newCategory,
        message: '创建成功（Mock 数据）'
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
      // 防御性处理
      const categoryId = Number(id)
      if (isNaN(categoryId) || categoryId <= 0) {
        return {
          success: false,
          data: null,
          message: '分类 ID 无效'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.delete(`/categories/${categoryId}`)
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('删除分类失败:', error.message)
      
      // Mock 实现：模拟删除成功
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const categoryId = Number(id)
      const index = mockCategories.findIndex(c => c.id === categoryId)
      
      if (index !== -1) {
        mockCategories.splice(index, 1)
        
        return {
          success: true,
          data: null,
          message: '删除成功（Mock 数据）'
        }
      } else {
        return {
          success: false,
          data: null,
          message: '分类不存在'
        }
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
      // 防御性处理
      if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.get(`/categories/${encodeURIComponent(categoryName.trim())}/posts`, {
        params: { page, limit }
      })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('使用 Mock 数据:', error.message)
      
      // Mock 实现：返回空数据（需要配合文章数据）
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return {
        success: true,
        data: {
          posts: [],
          total: 0,
          page,
          limit,
          totalPages: 0
        },
        message: '获取成功（Mock 数据）'
      }
    }
  }
}
