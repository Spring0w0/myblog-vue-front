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
  
  // 获取上传文件基础 URL
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || '/uploads'
  
  // 如果用户上传了封面，使用上传的封面
  if (cover && typeof cover === 'string' && cover.trim() !== '') {
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    const coverPath = cover.startsWith('/') ? cover : `/${cover}`
    const relativePath = coverPath.startsWith('/uploads') ? coverPath.substring(8) : coverPath
    return `${uploadsBaseUrl}${relativePath}`
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
  
  // 获取上传文件基础 URL
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || '/uploads'
  
  // 如果已经是完整路径，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 确保路径以 / 开头
  const imagePath = url.startsWith('/') ? url : `/${url}`
  // 确保路径不以 /uploads 开头
  const relativePath = imagePath.startsWith('/uploads') ? imagePath.substring(8) : imagePath
  // 拼接完整 URL
  return `${uploadsBaseUrl}${relativePath}`
}

/**
 * 获取头像完整 URL
 * @param {string} avatar - 数据库中的相对路径
 * @returns {string} 完整图片 URL
 */
export const getAvatarUrl = (avatar) => {
  // 防御性处理
  if (!avatar || typeof avatar !== 'string') {
    return '/assets/images/avatar.webp'
  }
  
  // 如果已经是完整路径，处理双斜杠问题
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    // 处理双斜杠，保留协议部分的双斜杠
    return avatar.replace(/(https?:\/\/)|(\/\/)/g, (match) => {
      return match === 'http://' || match === 'https://' ? match : '/'
    })
  }
  
  // 使用配置的基础 URL（开发和生产环境统一）
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL || '/uploads'
  
  // 确保路径以 / 开头
  const avatarPath = avatar.startsWith('/') ? avatar : `/${avatar}`
  // 确保路径不以 /uploads 开头
  let relativePath = avatarPath.startsWith('/uploads') ? avatarPath.substring(8) : avatarPath
  // 确保relativePath不以 / 开头
  relativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath
  // 确保uploadsBaseUrl不以 / 结尾
  const normalizedBaseUrl = uploadsBaseUrl.endsWith('/') ? uploadsBaseUrl.substring(0, uploadsBaseUrl.length - 1) : uploadsBaseUrl
  // 拼接完整 URL
  return `${normalizedBaseUrl}/${relativePath}`
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
