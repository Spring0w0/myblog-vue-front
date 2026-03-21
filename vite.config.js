import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  
  return {
    plugins: [vue()],
    server: {
      proxy: {
        // 配置 API 代理
        '/api': {
          target: 'http://localhost:8080', // 后端服务器地址
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          // 当后端服务不可用时，返回 404 避免 ECONNREFUSED 报错
          bypass: (req, res) => {
            if (req.url.startsWith('/api')) {
              res.statusCode = 404
              res.end('Backend service is not available')
              return true
            }
          }
        },
        // 配置图片代理
        '/uploads': {
          target: 'http://localhost:8080', // 后端服务器地址
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          // 当后端服务不可用时，尝试从本地 public 目录读取
          bypass: (req, res) => {
            // 构建本地文件路径
            const localPath = path.join(__dirname, 'public', req.url)
            
            // 检查本地文件是否存在
            if (fs.existsSync(localPath)) {
              // 如果存在，返回本地文件
              res.statusCode = 200
              const content = fs.readFileSync(localPath)
              res.end(content)
              return true
            } else {
              // 如果不存在，返回 404
              res.statusCode = 404
              res.end('File not found')
              return true
            }
          }
        }
      }
    }
  }
})
