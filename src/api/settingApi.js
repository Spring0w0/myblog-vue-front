import client from './client'

const settingApi = {
  getAllSettings: async () => {
    try {
      const response = await client.get('/admin/setting/all')
      return response
    } catch (error) {
      throw error
    }
  },

  batchUpdateSettings: async (configs) => {
    try {
      const response = await client.put('/admin/setting/batch', configs)
      return response
    } catch (error) {
      throw error
    }
  },

  getUserProfile: async () => {
    try {
      const response = await client.get('/admin/user/profile')
      return response
    } catch (error) {
      throw error
    }
  },

  updateUserProfile: async (profile) => {
    try {
      const response = await client.put('/admin/user/profile', profile)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default settingApi
