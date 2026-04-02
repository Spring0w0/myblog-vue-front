import apiClient from './client.js'

/**
 * 模拟统计数据
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
const mockStats = {
  articleTotal: 6,
  tagTotal: 15,
  categoryTotal: 4,
  totalViewCount: 1019,
  latestArticleTime: '2026-03-30T17:04:53'
}

/**
 * 统计 API 模块
 * 提供站点统计数据的查询功能
 * 由于后端未就绪，暂时保留 Mock 数据作为 Fallback
 */
export const statsApi = {
  /**
   * 获取站点统计数据
   * @returns {Promise<{success: boolean, data: {totalPosts: number, totalTags: number, totalCategories: number, totalViews: number}, message: string}>}
   */
  getStats: async () => {
    try {
      // 尝试调用真实 API
      const response = await apiClient.get('/stats')
      
      // 防御性处理：检查返回格式
      if (response && response.success && typeof response.data === 'object') {
        // 检查必要字段
        const data = response.data
        if (
          typeof data.articleTotal === 'number' &&
          typeof data.tagTotal === 'number' &&
          typeof data.categoryTotal === 'number' &&
          typeof data.totalViewCount === 'number'
        ) {
          return response
        }
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
        data: mockStats,
        message: '获取成功（Mock 数据）'
      }
    }
  },

  /**
   * 获取文章归档统计
   * 按年份和月份统计文章数量
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  getArchiveStats: async () => {
    try {
      // 尝试调用真实 API
      const response = await apiClient.get('/stats/archive')
      
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
      
      // Mock 归档数据
      const mockArchive = [
        {
          year: 2025,
          months: [
            { month: 3, count: 3 },
            { month: 2, count: 3 }
          ]
        }
      ]
      
      return {
        success: true,
        data: mockArchive,
        message: '获取成功（Mock 数据）'
      }
    }
  }
}
