import apiClient from './client.js'

export const adminCategoryApi = {
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/admin/category/all')

      if (response && response.success && Array.isArray(response.data)) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取全部分类失败:', error.message)
      return {
        success: false,
        data: [],
        message: '获取分类失败，请检查后端服务是否启动'
      }
    }
  },

  getCategories: async (page = 1, pageSize = 10, name = '') => {
    try {
      const params = { page, pageSize }
      if (name) params.name = name

      const response = await apiClient.get('/admin/category', { params })

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('分页查询分类失败:', error.message)
      return {
        success: false,
        data: null,
        message: '查询分类失败，请检查后端服务是否启动'
      }
    }
  },

  createCategory: async (name) => {
    try {
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }

      const response = await apiClient.post('/admin/category', { name: name.trim() })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('新增分类失败:', error.message)
      return {
        success: false,
        data: null,
        message: '新增分类失败，请检查后端服务是否启动'
      }
    }
  },

  getCategoryById: async (id) => {
    try {
      const categoryId = Number(id)
      if (isNaN(categoryId) || categoryId <= 0) {
        return {
          success: false,
          data: null,
          message: '分类 ID 无效'
        }
      }

      const response = await apiClient.get(`/admin/category/${categoryId}`)

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取分类详情失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取分类详情失败，请检查后端服务是否启动'
      }
    }
  },

  updateCategory: async (id, name, status) => {
    try {
      const categoryId = Number(id)
      if (isNaN(categoryId) || categoryId <= 0) {
        return {
          success: false,
          data: null,
          message: '分类 ID 无效'
        }
      }

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return {
          success: false,
          data: null,
          message: '分类名称不能为空'
        }
      }

      const response = await apiClient.put(`/admin/category/${categoryId}`, {
        id: categoryId,
        name: name.trim(),
        status
      })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('更新分类失败:', error.message)
      return {
        success: false,
        data: null,
        message: '更新分类失败，请检查后端服务是否启动'
      }
    }
  },

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

      const response = await apiClient.delete(`/admin/category/${categoryId}`)

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
  }
}
