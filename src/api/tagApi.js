import apiClient from './client.js'

/**
 * 模拟标签数据
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
const mockTags = [
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
]

/**
 * 标签 API 模块
 * 提供标签的增删改查功能
 * 由于后端未就绪，暂时保留 Mock 数据作为 Fallback
 */
export const tagApi = {
  /**
   * 获取所有标签
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getAllTags: async () => {
    try {
      // 尝试调用真实 API
      const response = await apiClient.get('/tags')
      
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
        data: mockTags,
        message: '获取成功（Mock 数据）'
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
      // 防御性处理：检查数据
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.post('/tags', { name: name.trim() })
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('创建标签失败:', error.message)
      
      // Mock 实现：模拟创建成功
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // 检查是否已存在
      const existingTag = mockTags.find(t => t.name === name.trim())
      if (existingTag) {
        return {
          success: false,
          data: null,
          message: '标签已存在'
        }
      }
      
      const newTag = {
        id: mockTags.length + 1,
        name: name.trim(),
        postCount: 0
      }
      
      mockTags.push(newTag)
      
      return {
        success: true,
        data: newTag,
        message: '创建成功（Mock 数据）'
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
      // 防御性处理
      const tagId = Number(id)
      if (isNaN(tagId) || tagId <= 0) {
        return {
          success: false,
          data: null,
          message: '标签 ID 无效'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.delete(`/tags/${tagId}`)
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.log('删除标签失败:', error.message)
      
      // Mock 实现：模拟删除成功
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const tagId = Number(id)
      const index = mockTags.findIndex(t => t.id === tagId)
      
      if (index !== -1) {
        mockTags.splice(index, 1)
        
        return {
          success: true,
          data: null,
          message: '删除成功（Mock 数据）'
        }
      } else {
        return {
          success: false,
          data: null,
          message: '标签不存在'
        }
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
      // 防御性处理
      if (!tagName || typeof tagName !== 'string' || tagName.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }
      
      // 尝试调用真实 API
      const response = await apiClient.get(`/tags/${encodeURIComponent(tagName.trim())}/posts`, {
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
