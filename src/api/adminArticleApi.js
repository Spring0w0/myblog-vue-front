import apiClient from './client.js'

export const adminArticleApi = {
  getArticles: async (page = 1, pageSize = 10, title = '', status = null) => {
    try {
      const params = { page, pageSize }
      if (title) params.title = title
      if (status !== null && status !== undefined && status !== '') params.status = status

      const response = await apiClient.get('/admin/article', { params })

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('分页查询文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '查询文章失败，请检查后端服务是否启动'
      }
    }
  },

  getArticleById: async (id) => {
    try {
      const articleId = Number(id)
      if (isNaN(articleId) || articleId <= 0) {
        return {
          success: false,
          data: null,
          message: '文章 ID 无效'
        }
      }

      const response = await apiClient.get(`/admin/article/${articleId}`)

      if (response && response.success && response.data) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取文章详情失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取文章详情失败，请检查后端服务是否启动'
      }
    }
  },

  createArticle: async (data) => {
    try {
      if (!data || !data.title || !data.content) {
        return {
          success: false,
          data: null,
          message: '文章标题和内容不能为空'
        }
      }

      const response = await apiClient.post('/admin/article', {
        title: data.title.trim(),
        cover: data.cover || '',
        summary: data.summary || '',
        content: data.content,
        status: data.status ?? 0,
        tagIds: data.tagIds || [],
        categoryId: data.categoryId || null
      })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('新建文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '新建文章失败，请检查后端服务是否启动'
      }
    }
  },

  updateArticle: async (data) => {
    try {
      if (!data || !data.id) {
        return {
          success: false,
          data: null,
          message: '文章 ID 不能为空'
        }
      }

      const response = await apiClient.put(`/admin/article/${data.id}`, {
        id: data.id,
        title: data.title.trim(),
        cover: data.cover || '',
        summary: data.summary || '',
        content: data.content,
        status: data.status ?? 0,
        tagIds: data.tagIds || [],
        categoryId: data.categoryId || null
      })

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('更新文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '更新文章失败，请检查后端服务是否启动'
      }
    }
  },

  deleteArticle: async (id) => {
    try {
      const articleId = Number(id)
      if (isNaN(articleId) || articleId <= 0) {
        return {
          success: false,
          data: null,
          message: '文章 ID 无效'
        }
      }

      const response = await apiClient.delete(`/admin/article/${articleId}`)

      if (response && response.success) {
        return response
      }

      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('删除文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '删除文章失败，请检查后端服务是否启动'
      }
    }
  }
}
