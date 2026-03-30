import apiClient from './client.js'

export const adminTagApi = {
  getAllTags: async () => {
    try {
      const response = await apiClient.get('/admin/tag/all')

      if (response && response.success && Array.isArray(response.data)) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取全部标签失败:', error.message)
      return {
        success: false,
        data: [],
        message: '获取标签失败，请检查后端服务是否启动'
      }
    }
  },

  getTags: async (page = 1, pageSize = 10, name = '') => {
    try {
      const params = { page, pageSize }
      if (name) params.name = name

      const response = await apiClient.get('/admin/tag', { params })

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('分页查询标签失败:', error.message)
      return {
        success: false,
        data: null,
        message: '查询标签失败，请检查后端服务是否启动'
      }
    }
  },

  createTag: async (name) => {
    try {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }

      const response = await apiClient.post('/admin/tag', { name: name.trim() })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('新增标签失败:', error.message)
      return {
        success: false,
        data: null,
        message: '新增标签失败，请检查后端服务是否启动'
      }
    }
  },

  getTagById: async (id) => {
    try {
      const tagId = Number(id)
      if (isNaN(tagId) || tagId <= 0) {
        return {
          success: false,
          data: null,
          message: '标签 ID 无效'
        }
      }

      const response = await apiClient.get(`/admin/tag/${tagId}`)

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取标签详情失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取标签详情失败，请检查后端服务是否启动'
      }
    }
  },

  updateTag: async (id, name, status) => {
    try {
      const tagId = Number(id)
      if (isNaN(tagId) || tagId <= 0) {
        return {
          success: false,
          data: null,
          message: '标签 ID 无效'
        }
      }

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '标签名称不能为空'
        }
      }

      const response = await apiClient.put(`/admin/tag/${tagId}`, {
        id: tagId,
        name: name.trim(),
        status
      })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('更新标签失败:', error.message)
      return {
        success: false,
        data: null,
        message: '更新标签失败，请检查后端服务是否启动'
      }
    }
  },

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

      const response = await apiClient.delete(`/admin/tag/${tagId}`)

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
  }
}
