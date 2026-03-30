import client from './client'

/**
 * 认证相关API
 */
const authApi = {
  /**
   * 管理员登录
   * @param {string} username 用户名
   * @param {string} password 密码
   * @returns {Promise} 登录结果
   */
  login: async (username, password) => {
    try {
      const response = await client.post('/login', {
        username,
        password
      })
      return response
    } catch (error) {
      throw error
    }
  }
}

export default authApi
