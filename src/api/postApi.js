import apiClient from './client.js'

/**
 * 模拟文章数据（已注释，联调阶段使用真实后端数据）
 * 作为 Fallback（后备），在接口返回 null 或非预期格式时使用
 */
/* const mockPosts = [
  {
    id: 1,
    title: '樱花季的回忆',
    summary: '每年的樱花季总是让人心情愉悦，今年也不例外。走在樱花树下，花瓣飘落的瞬间，仿佛时间都静止了。',
    content: '# 樱花季的回忆\n\n每年的樱花季总是让人心情愉悦，今年也不例外。走在樱花树下，花瓣飘落的瞬间，仿佛时间都静止了。\n\n## 赏花地点\n\n今年去了上野公园，那里的樱花真的很美。\n\n## 拍摄技巧\n\n拍摄樱花时，最好选择清晨或傍晚，光线柔和，效果更佳。',
    cover: '',
    tags: '生活,摄影,樱花',
    categories: '生活',
    status: 'PUBLISHED',
    viewCount: 128,
    createAt: '2025-03-15T10:00:00',
    updateAt: '2025-03-15T10:00:00'
  },
  {
    id: 2,
    title: '东京旅行日记',
    summary: '为期一周的东京之旅，探索了许多著名景点，品尝了当地美食，留下了美好的回忆。',
    content: '# 东京旅行日记\n\n为期一周的东京之旅，探索了许多著名景点，品尝了当地美食，留下了美好的回忆。\n\n## 必去景点\n\n- 东京塔\n- 浅草寺\n- 明治神宫\n\n## 美食推荐\n\n筑地市场的寿司真的很新鲜！',
    cover: '',
    tags: '旅行,日本,美食',
    categories: '旅行',
    status: 'PUBLISHED',
    viewCount: 256,
    createAt: '2025-03-10T14:30:00',
    updateAt: '2025-03-10T14:30:00'
  },
  {
    id: 3,
    title: '春季穿搭指南',
    summary: '春天来了，是时候更新衣橱了。分享一些春季穿搭灵感，让你在这个季节既时尚又舒适。',
    content: '# 春季穿搭指南\n\n春天来了，是时候更新衣橱了。分享一些春季穿搭灵感，让你在这个季节既时尚又舒适。\n\n## 必备单品\n\n- 轻薄外套\n- 碎花连衣裙\n- 小白鞋\n\n## 搭配技巧\n\n层次感很重要，可以尝试叠穿。',
    cover: '',
    tags: '时尚,穿搭,春季',
    categories: '时尚',
    status: 'PUBLISHED',
    viewCount: 89,
    createAt: '2025-03-05T09:15:00',
    updateAt: '2025-03-05T09:15:00'
  },
  {
    id: 4,
    title: '咖啡爱好者的日常',
    summary: '作为一名咖啡爱好者，每天的咖啡时光是最享受的。分享一些自己喜欢的咖啡豆和冲泡方法。',
    content: '# 咖啡爱好者的日常\n\n作为一名咖啡爱好者，每天的咖啡时光是最享受的。分享一些自己喜欢的咖啡豆和冲泡方法。\n\n## 推荐咖啡豆\n\n- 蓝山咖啡\n- 哥伦比亚咖啡\n- 埃塞俄比亚咖啡\n\n## 冲泡技巧\n\n手冲咖啡的关键是控制水温在92-96℃之间。',
    cover: '',
    tags: '咖啡,生活,美食',
    categories: '生活',
    status: 'PUBLISHED',
    viewCount: 167,
    createAt: '2025-02-28T16:45:00',
    updateAt: '2025-02-28T16:45:00'
  },
  {
    id: 5,
    title: '电影推荐：春天的故事',
    summary: '春天是适合看电影的季节，推荐几部关于春天的电影，让你感受春天的美好。',
    content: '# 电影推荐：春天的故事\n\n春天是适合看电影的季节，推荐几部关于春天的电影，让你感受春天的美好。\n\n## 推荐电影\n\n1. 《小森林 春冬篇》\n2. 《秒速五厘米》\n3. 《四月物语》\n\n## 观影感受\n\n这些电影都能让人感受到春天的气息和生命的美好。',
    cover: '',
    tags: '电影,推荐,春天',
    categories: '娱乐',
    status: 'PUBLISHED',
    viewCount: 234,
    createAt: '2025-02-20T19:30:00',
    updateAt: '2025-02-20T19:30:00'
  },
  {
    id: 6,
    title: '室内植物养护指南',
    summary: '春天是植物生长的季节，分享一些室内植物的养护技巧，让你的家充满生机。',
    content: '# 室内植物养护指南\n\n春天是植物生长的季节，分享一些室内植物的养护技巧，让你的家充满生机。\n\n## 推荐植物\n\n- 绿萝\n- 龟背竹\n- 多肉植物\n\n## 养护技巧\n\n春天要适当增加浇水和施肥的频率。',
    cover: '',
    tags: '植物,生活,养护',
    categories: '生活',
    status: 'PUBLISHED',
    viewCount: 145,
    createAt: '2025-02-15T11:20:00',
    updateAt: '2025-02-15T11:20:00'
  }
] */

/**
 * 文章 API 模块
 * 提供文章的增删改查功能
 */
export const postApi = {
  /**
   * 获取文章列表
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @param {Object} filters - 过滤条件 { tags: Array, category: String }
   * @returns {Promise<{success: boolean, data: {posts: Array, total: number, page: number, limit: number, totalPages: number}, message: string}>}
   */
  getPosts: async (page = 1, limit = 6, filters = {}) => {
    try {
      const response = await apiClient.get('/posts', {
        params: { page, limit, ...filters }
      })
      
      if (response && response.success && Array.isArray(response.data?.posts)) {
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
  getPostById: async (id) => {
    try {
      const postId = Number(id)
      if (isNaN(postId) || postId <= 0) {
        return {
          success: false,
          data: null,
          message: '文章 ID 无效'
        }
      }
      
      const response = await apiClient.get(`/posts/${postId}`)
      
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
  createPost: async (data) => {
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
      
      const response = await apiClient.post('/posts', data)
      
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
  updatePost: async (id, data) => {
    try {
      const postId = Number(id)
      if (isNaN(postId) || postId <= 0) {
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
      
      const response = await apiClient.put(`/posts/${postId}`, data)
      
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
  deletePost: async (id) => {
    try {
      const postId = Number(id)
      if (isNaN(postId) || postId <= 0) {
        return {
          success: false,
          data: null,
          message: '文章 ID 无效'
        }
      }
      
      const response = await apiClient.delete(`/posts/${postId}`)
      
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
