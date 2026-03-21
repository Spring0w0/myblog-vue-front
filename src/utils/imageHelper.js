/**
 * 图片处理工具函数
 * 提供统一的图片 URL 拼接和默认封面轮换逻辑
 */

/**
 * 检测是否为开发环境
 */
const isDevelopment = () => {
  return import.meta.env.DEV
}

/**
 * 获取封面图片完整 URL
 * @param {string} cover - 数据库中的相对路径（如：covers/user/2026/03/uuid.webp）
 * @param {number} postId - 文章 ID，用于默认封面轮换
 * @returns {string} 完整图片 URL
 */
export const getCoverUrl = (cover, postId = 1) => {
  // 防御性处理：确保 postId 是有效数字
  const validPostId = Number(postId) || 1
  
  // 如果用户上传了封面，使用上传的封面
  if (cover && typeof cover === 'string' && cover.trim() !== '') {
    // 开发环境下，如果后端不可用，使用本地静态资源
    if (isDevelopment()) {
      // 尝试使用本地静态资源（如果存在）
      const localPath = `/uploads${cover.startsWith('/') ? '' : '/'}${cover}`
      return localPath
    }
    
    // 确保路径以 /uploads/ 开头
    if (cover.startsWith('/uploads/')) {
      return cover
    }
    return `/uploads/${cover}`
  }
  
  // 默认封面轮换逻辑：根据 postId 计算索引 (1-6)
  // 公式：(postId % 6) + 1，结果范围 1-6
  const defaultIndex = (validPostId % 6) + 1
  // 默认封面使用独立路径，不经过代理，开发和生产环境统一
  return `/default-covers/${defaultIndex}.webp`
}

/**
 * 获取文章插图完整 URL
 * @param {string} url - 数据库中的相对路径
 * @returns {string} 完整图片 URL
 */
export const getArticleImageUrl = (url) => {
  // 防御性处理
  if (!url || typeof url !== 'string') {
    return ''
  }
  
  // 如果已经是完整路径，直接返回
  if (url.startsWith('/uploads/')) {
    return url
  }
  
  // 如果包含 http/https，说明是外部链接，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 拼接 /uploads/ 前缀
  return `/uploads/${url}`
}

/**
 * 解析逗号分隔的标签字符串为数组
 * @param {string} tagsString - 逗号分隔的标签字符串（如："生活,摄影,樱花"）
 * @returns {string[]} 标签数组
 */
export const parseTags = (tagsString) => {
  // 防御性处理
  if (!tagsString || typeof tagsString !== 'string') {
    return []
  }
  
  // 分割并清理空白字符
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

/**
 * 解析逗号分隔的分类字符串为数组
 * @param {string} categoriesString - 逗号分隔的分类字符串
 * @returns {string[]} 分类数组
 */
export const parseCategories = (categoriesString) => {
  // 防御性处理
  if (!categoriesString || typeof categoriesString !== 'string') {
    return []
  }
  
  // 分割并清理空白字符
  return categoriesString
    .split(',')
    .map(category => category.trim())
    .filter(category => category.length > 0)
}

/**
 * 将标签数组转换为逗号分隔的字符串
 * @param {string[]} tagsArray - 标签数组
 * @returns {string} 逗号分隔的字符串
 */
export const stringifyTags = (tagsArray) => {
  // 防御性处理
  if (!Array.isArray(tagsArray)) {
    return ''
  }
  
  return tagsArray
    .map(tag => String(tag).trim())
    .filter(tag => tag.length > 0)
    .join(',')
}

/**
 * 将分类数组转换为逗号分隔的字符串
 * @param {string[]} categoriesArray - 分类数组
 * @returns {string} 逗号分隔的字符串
 */
export const stringifyCategories = (categoriesArray) => {
  // 防御性处理
  if (!Array.isArray(categoriesArray)) {
    return ''
  }
  
  return categoriesArray
    .map(category => String(category).trim())
    .filter(category => category.length > 0)
    .join(',')
}
