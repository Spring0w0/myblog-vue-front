import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // 配置静态资源目录，让前端直接访问deploy目录
    fs: {
      allow: ['..']
    }
  },
  // 配置服务器中间件
  configureServer: (server) => {
    // 全局中间件，记录所有请求
    server.middlewares.use((req, res, next) => {
      console.log('Received request:', req.method, req.url)
      next()
    })
    
    // 处理uploads路径的中间件
    server.middlewares.use('/uploads', (req, res, next) => {
      console.log('Processing uploads request:', req.url)
      // 构建完整的文件路径
      const filePath = path.join(__dirname, '../deploy/data/uploads', req.url)
      console.log('Requesting file:', filePath)
      
      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        console.log('File exists:', filePath)
        // 读取文件并发送
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error('Error reading file:', err)
            res.statusCode = 500
            res.end('Internal server error')
          } else {
            // 根据文件扩展名设置Content-Type
            const ext = path.extname(filePath)
            const contentTypeMap = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp'
            }
            const contentType = contentTypeMap[ext] || 'application/octet-stream'
            res.setHeader('Content-Type', contentType)
            console.log('Sending file with content-type:', contentType)
            res.end(data)
          }
        })
      } else {
        console.error('File not found:', filePath)
        res.statusCode = 404
        res.end('File not found')
      }
    })
  },
  // 配置别名，方便引用deploy目录
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@deploy': path.resolve(__dirname, '../deploy')
    }
  },
  // 配置静态资源目录
  publicDir: 'public'
})