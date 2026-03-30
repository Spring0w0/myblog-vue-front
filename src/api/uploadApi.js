import client from './client'

const uploadApi = {
  uploadImage: async (file, bizType) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bizType', bizType)

      const response = await client.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    } catch (error) {
      throw error
    }
  }
}

export default uploadApi
