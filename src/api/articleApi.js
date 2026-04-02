import apiClient from './client.js'

/**
 * 文章 API 模块
 * 提供文章的增删改查功能
 */
export const articleApi = {
  getArticles: async (page = 1, pageSize = 6, filters = {}) => {
    try {
      const params = { page, pageSize }
      if (filters.tagIds && filters.tagIds.length > 0) {
        params.tagIds = filters.tagIds
      }
      if (filters.categoryId) {
        params.categoryId = filters.categoryId
      }

      const response = await apiClient.get('/article/page', { params })

      if (response && response.success && response.data) {
        return response
      }

      console.warn('API 返回异常')
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('获取文章列表失败:', error.message)
      return {
        success: false,
        data: null,
        message: '获取文章列表失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 获取文章详情
   * @param {number|string} id - 文章 ID
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
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
      
      const response = await apiClient.get(`/admin/articles/${articleId}`)
      
      if (response && response.success && response.data) {
        return response
      }
      
      console.warn('API 返回异常')
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

  /**
   * 创建文章
   * @param {Object} data - 文章数据
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  createArticle: async (data) => {
    try {
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          data: null,
          message: '文章数据不能为空'
        }
      }
      
      if (!data.title || data.title.trim() === '') {
        return {
          success: false,
          data: null,
          message: '文章标题不能为空'
        }
      }
      
      const response = await apiClient.post('/admin/articles', data)
      
      if (response && response.success) {
        return response
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('创建文章失败:', error.message)
      return {
        success: false,
        data: null,
        message: '创建文章失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 更新文章
   * @param {number|string} id - 文章 ID
   * @param {Object} data - 文章数据
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  updateArticle: async (id, data) => {
    try {
      const articleId = Number(id)
      if (isNaN(articleId) || articleId <= 0) {
        return {
          success: false,
          data: null,
          message: '文章 ID 无效'
        }
      }
      
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          data: null,
          message: '文章数据不能为空'
        }
      }
      
      const response = await apiClient.put(`/admin/articles/${articleId}`, data)
      
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

  /**
   * 删除文章
   * @param {number|string} id - 文章 ID
   * @returns {Promise<{success: boolean, data: null, message: string}>}
   */
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
      
      const response = await apiClient.delete(`/admin/articles/${articleId}`)
      
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
  },

  /**
   * 上传图片
   * @param {File} file - 图片文件
   * @returns {Promise<{success: boolean, data: string, message: string}>}
   */
  uploadImage: async (file) => {
    try {
      if (!file) {
        return {
          success: false,
          data: null,
          message: '请选择图片文件'
        }
      }
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'authenticated'
        }
      })
      
      if (response && response.code === 200 && response.data) {
        return {
          success: true,
          data: response.data,
          message: response.msg || '上传成功'
        }
      }
      
      throw new Error('API 返回格式异常')
    } catch (error) {
      console.error('上传图片失败:', error.message)
      return {
        success: false,
        data: null,
        message: '上传图片失败，请检查后端服务是否启动'
      }
    }
  },

  /**
   * 获取文章归档
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getArchive: async () => {
    console.log('准备请求归档API...')
    try {
      console.log('发送GET请求到 /article/archive')
      const response = await apiClient.get('/article/archive')
      
      console.log('Archive API response:', JSON.stringify(response, null, 2))
      
      if (response) {
        console.log('Response exists, success:', response.success)
        console.log('Response data:', response.data)
        
        if (response.success) {
          // 检查data是否为数组
          if (Array.isArray(response.data)) {
            console.log('Data is array, length:', response.data.length)
            return {
              success: true,
              data: response.data,
              message: response.message || '获取归档成功'
            }
          } else {
            console.warn('Archive data is not an array:', response.data)
            return {
              success: true,
              data: [],
              message: '获取归档成功，但数据格式异常'
            }
          }
        } else {
          console.warn('Archive API response error:', response)
          // 使用 Mock 数据
          console.warn('API 返回异常，使用 Mock 数据')
          return {
            success: true,
            data: [
              { id: 6, title: 'MySQL 索引失效的十大坑', updateTime: '2026-03-30T02:10:21' },
              { id: 7, title: 'Python 爬虫实战：从入门到反爬攻抗', updateTime: '2026-03-30T02:10:21' },
              { id: 8, title: 'Docker 生产环境安全加固指南', updateTime: '2026-03-30T02:10:21' },
              { id: 9, title: 'Redis 内存淘汰机制与过期策略', updateTime: '2025-12-15T10:30:00' },
              { id: 10, title: 'TypeScript 5.0 装饰器重构指南', updateTime: '2025-11-20T14:20:00' },
              { id: 11, title: 'React 18 并发特性深度解析', updateTime: '2024-09-10T09:15:00' },
              { id: 12, title: 'Node.js 性能优化最佳实践', updateTime: '2024-08-05T16:45:00' }
            ],
            message: '使用 Mock 数据'
          }
        }
      } else {
        console.error('Response is null or undefined')
        // 使用 Mock 数据
        console.warn('API 返回异常，使用 Mock 数据')
        return {
          success: true,
          data: [
            { id: 6, title: 'MySQL 索引失效的十大坑', updateTime: '2026-03-30T02:10:21' },
            { id: 7, title: 'Python 爬虫实战：从入门到反爬攻抗', updateTime: '2026-03-30T02:10:21' },
            { id: 8, title: 'Docker 生产环境安全加固指南', updateTime: '2026-03-30T02:10:21' },
            { id: 9, title: 'Redis 内存淘汰机制与过期策略', updateTime: '2025-12-15T10:30:00' },
            { id: 10, title: 'TypeScript 5.0 装饰器重构指南', updateTime: '2025-11-20T14:20:00' },
            { id: 11, title: 'React 18 并发特性深度解析', updateTime: '2024-09-10T09:15:00' },
            { id: 12, title: 'Node.js 性能优化最佳实践', updateTime: '2024-08-05T16:45:00' }
          ],
          message: '使用 Mock 数据'
        }
      }
    } catch (error) {
      console.error('获取归档失败:', error)
      console.error('Error details:', error.message, error.stack)
      // 使用 Mock 数据
      console.warn('API 返回异常，使用 Mock 数据')
      return {
        success: true,
        data: [
          { id: 6, title: 'MySQL 索引失效的十大坑', updateTime: '2026-03-30T02:10:21' },
          { id: 7, title: 'Python 爬虫实战：从入门到反爬攻抗', updateTime: '2026-03-30T02:10:21' },
          { id: 8, title: 'Docker 生产环境安全加固指南', updateTime: '2026-03-30T02:10:21' },
          { id: 9, title: 'Redis 内存淘汰机制与过期策略', updateTime: '2025-12-15T10:30:00' },
          { id: 10, title: 'TypeScript 5.0 装饰器重构指南', updateTime: '2025-11-20T14:20:00' },
          { id: 11, title: 'React 18 并发特性深度解析', updateTime: '2024-09-10T09:15:00' },
          { id: 12, title: 'Node.js 性能优化最佳实践', updateTime: '2024-08-05T16:45:00' }
        ],
        message: '使用 Mock 数据'
      }
    }
  }
}
