import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 模拟文章数据
const mockPosts = [
  {
    id: 1,
    title: '樱花季的回忆',
    summary: '每年的樱花季总是让人心情愉悦，今年也不例外。走在樱花树下，花瓣飘落的瞬间，仿佛时间都静止了。',
    content: '# 樱花季的回忆\n\n每年的樱花季总是让人心情愉悦，今年也不例外。走在樱花树下，花瓣飘落的瞬间，仿佛时间都静止了。\n\n## 赏花地点\n\n今年去了上野公园，那里的樱花真的很美。\n\n## 拍摄技巧\n\n拍摄樱花时，最好选择清晨或傍晚，光线柔和，效果更佳。',
    cover: '/assets/desktop-banner/1.webp',
    tags: ['生活', '摄影', '樱花'],
    createdAt: '2025-03-15T10:00:00',
    updatedAt: '2025-03-15T10:00:00',
    readTime: 3
  },
  {
    id: 2,
    title: '东京旅行日记',
    summary: '为期一周的东京之旅，探索了许多著名景点，品尝了当地美食，留下了美好的回忆。',
    content: '# 东京旅行日记\n\n为期一周的东京之旅，探索了许多著名景点，品尝了当地美食，留下了美好的回忆。\n\n## 必去景点\n\n- 东京塔\n- 浅草寺\n- 明治神宫\n\n## 美食推荐\n\n筑地市场的寿司真的很新鲜！',
    cover: '/assets/desktop-banner/2.webp',
    tags: ['旅行', '日本', '美食'],
    createdAt: '2025-03-10T14:30:00',
    updatedAt: '2025-03-10T14:30:00',
    readTime: 5
  },
  {
    id: 3,
    title: '春季穿搭指南',
    summary: '春天来了，是时候更新衣橱了。分享一些春季穿搭灵感，让你在这个季节既时尚又舒适。',
    content: '# 春季穿搭指南\n\n春天来了，是时候更新衣橱了。分享一些春季穿搭灵感，让你在这个季节既时尚又舒适。\n\n## 必备单品\n\n- 轻薄外套\n- 碎花连衣裙\n- 小白鞋\n\n## 搭配技巧\n\n层次感很重要，可以尝试叠穿。',
    cover: '/assets/desktop-banner/3.webp',
    tags: ['时尚', '穿搭', '春季'],
    createdAt: '2025-03-05T09:15:00',
    updatedAt: '2025-03-05T09:15:00',
    readTime: 4
  },
  {
    id: 4,
    title: '咖啡爱好者的日常',
    summary: '作为一名咖啡爱好者，每天的咖啡时光是最享受的。分享一些自己喜欢的咖啡豆和冲泡方法。',
    content: '# 咖啡爱好者的日常\n\n作为一名咖啡爱好者，每天的咖啡时光是最享受的。分享一些自己喜欢的咖啡豆和冲泡方法。\n\n## 推荐咖啡豆\n\n- 蓝山咖啡\n- 哥伦比亚咖啡\n- 埃塞俄比亚咖啡\n\n## 冲泡技巧\n\n手冲咖啡的关键是控制水温在92-96℃之间。',
    cover: '/assets/desktop-banner/4.webp',
    tags: ['咖啡', '生活', '美食'],
    createdAt: '2025-02-28T16:45:00',
    updatedAt: '2025-02-28T16:45:00',
    readTime: 3
  },
  {
    id: 5,
    title: '电影推荐：春天的故事',
    summary: '春天是适合看电影的季节，推荐几部关于春天的电影，让你感受春天的美好。',
    content: '# 电影推荐：春天的故事\n\n春天是适合看电影的季节，推荐几部关于春天的电影，让你感受春天的美好。\n\n## 推荐电影\n\n1. 《小森林 春冬篇》\n2. 《秒速五厘米》\n3. 《四月物语》\n\n## 观影感受\n\n这些电影都能让人感受到春天的气息和生命的美好。',
    cover: '/assets/desktop-banner/5.webp',
    tags: ['电影', '推荐', '春天'],
    createdAt: '2025-02-20T19:30:00',
    updatedAt: '2025-02-20T19:30:00',
    readTime: 4
  },
  {
    id: 6,
    title: '室内植物养护指南',
    summary: '春天是植物生长的季节，分享一些室内植物的养护技巧，让你的家充满生机。',
    content: '# 室内植物养护指南\n\n春天是植物生长的季节，分享一些室内植物的养护技巧，让你的家充满生机。\n\n## 推荐植物\n\n- 绿萝\n- 龟背竹\n- 多肉植物\n\n## 养护技巧\n\n春天要适当增加浇水和施肥的频率。',
    cover: '/assets/desktop-banner/6.webp',
    tags: ['植物', '生活', '养护'],
    createdAt: '2025-02-15T11:20:00',
    updatedAt: '2025-02-15T11:20:00',
    readTime: 3
  }
]

// 文章 API
export const postApi = {
  // 获取文章列表
  getPosts: async (page = 1, limit = 6) => {
    try {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 计算分页
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedPosts = mockPosts.slice(start, end)
      
      return {
        success: true,
        data: {
          posts: paginatedPosts,
          total: mockPosts.length,
          page,
          limit,
          totalPages: Math.ceil(mockPosts.length / limit)
        }
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
      return {
        success: false,
        message: '获取文章列表失败'
      }
    }
  },

  // 获取文章详情
  getPostById: async (id) => {
    try {
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const post = mockPosts.find(p => p.id === parseInt(id))
      
      if (post) {
        return {
          success: true,
          data: post
        }
      } else {
        return {
          success: false,
          message: '文章不存在'
        }
      }
    } catch (error) {
      console.error('获取文章详情失败:', error)
      return {
        success: false,
        message: '获取文章详情失败'
      }
    }
  }
}
