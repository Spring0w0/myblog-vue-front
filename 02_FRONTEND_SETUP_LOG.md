# MyBlog Vue Frontend 初始化日志

> 技术栈: Vue 3 + Vite + Tailwind CSS  
> 初始化日期: 2026-03-19  
> 版本: v1.0

---

## 一、项目初始化

### 1.1 创建 Vue 3 项目

```powershell
cd d:\MizukiCode
npm create vite@latest myblog-vue-front -- --template vue --force
```

**说明**: 使用 Vite 创建 Vue 3 项目，模板选择 `vue`（默认使用 Composition API）。

### 1.2 项目结构

```
myblog-vue-front/
├── public/
│   ├── assets/
│   │   ├── home/           # Logo 和导航图标
│   │   ├── desktop-banner/ # 桌面端 Banner 图片
│   │   └── mobile-banner/  # 移动端 Banner 图片
│   └── favicon/            # 网站图标
├── src/
│   ├── assets/
│   │   ├── fonts/          # 字体文件
│   │   └── images/         # 图片资源
│   ├── components/
│   │   └── common/         # 公共组件
│   ├── layouts/
│   │   └── MainLayout.vue  # 主布局组件
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 二、依赖安装

### 2.1 安装 Tailwind CSS

```powershell
cd d:\MizukiCode\myblog-vue-front
npm install -D tailwindcss postcss autoprefixer
```

### 2.2 安装 Axios 和 Lucide-Vue-Next

```powershell
npm install axios lucide-vue-next
```

### 2.3 依赖清单

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| vue | ^3.x | Vue 3 框架 |
| vite | ^8.x | 构建工具 |
| tailwindcss | ^4.x | CSS 框架 |
| postcss | ^8.x | CSS 处理器 |
| autoprefixer | ^10.x | CSS 自动前缀 |
| axios | ^1.x | HTTP 客户端 |
| lucide-vue-next | ^0.x | 图标库 |

---

## 三、素材迁移

### 3.1 迁移清单

以下文件从 Astro 项目 (`mizuki`) 迁移到 Vue 项目 (`myblog-vue-front`):

| 原始路径 | 目标路径 | 用途 |
|----------|----------|------|
| `mizuki/public/assets/home/default-logo.png` | `myblog-vue-front/public/assets/home/default-logo.png` | 网站 Logo |
| `mizuki/public/assets/home/home.png` | `myblog-vue-front/public/assets/home/home.png` | 导航图标 |
| `mizuki/public/favicon/favicon.ico` | `myblog-vue-front/public/favicon/favicon.ico` | 网站图标 |
| `mizuki/src/assets/images/avatar.webp` | `myblog-vue-front/src/assets/images/avatar.webp` | 默认头像 |
| `mizuki/public/assets/font/ZenMaruGothic-Medium.ttf` | `myblog-vue-front/src/assets/fonts/ZenMaruGothic-Medium.ttf` | 主字体 |
| `mizuki/public/assets/font/萝莉体 第二版.ttf` | `myblog-vue-front/src/assets/fonts/萝莉体 第二版.ttf` | 辅助字体 |
| `mizuki/public/assets/desktop-banner/*.webp` | `myblog-vue-front/public/assets/desktop-banner/*.webp` | 桌面端 Banner (6张) |
| `mizuki/public/assets/mobile-banner/*.webp` | `myblog-vue-front/public/assets/mobile-banner/*.webp` | 移动端 Banner (6张) |

### 3.2 迁移命令

```powershell
# 创建目标目录
New-Item -ItemType Directory -Force -Path src/assets/images
New-Item -ItemType Directory -Force -Path src/assets/fonts
New-Item -ItemType Directory -Force -Path public/assets/home
New-Item -ItemType Directory -Force -Path public/assets/desktop-banner
New-Item -ItemType Directory -Force -Path public/assets/mobile-banner
New-Item -ItemType Directory -Force -Path public/favicon

# 拷贝文件
Copy-Item "d:\MizukiCode\mizuki\public\assets\home\default-logo.png" "d:\MizukiCode\myblog-vue-front\public\assets\home\"
Copy-Item "d:\MizukiCode\mizuki\public\assets\home\home.png" "d:\MizukiCode\myblog-vue-front\public\assets\home\"
Copy-Item "d:\MizukiCode\mizuki\public\favicon\favicon.ico" "d:\MizukiCode\myblog-vue-front\public\favicon\"
Copy-Item "d:\MizukiCode\mizuki\src\assets\images\avatar.webp" "d:\MizukiCode\myblog-vue-front\src\assets\images\"
Copy-Item "d:\MizukiCode\mizuki\public\assets\font\ZenMaruGothic-Medium.ttf" "d:\MizukiCode\myblog-vue-front\src\assets\fonts\"
Copy-Item "d:\MizukiCode\mizuki\public\assets\font\萝莉体 第二版.ttf" "d:\MizukiCode\myblog-vue-front\src\assets\fonts\"
Copy-Item "d:\MizukiCode\mizuki\public\assets\desktop-banner\*.webp" "d:\MizukiCode\myblog-vue-front\public\assets\desktop-banner\"
Copy-Item "d:\MizukiCode\mizuki\public\assets\mobile-banner\*.webp" "d:\MizukiCode\myblog-vue-front\public\assets\mobile-banner\"
```

---

## 四、Tailwind CSS 配置

### 4.1 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'oklch(0.70 0.14 var(--hue) / <alpha-value>)',
          dark: 'oklch(0.75 0.14 var(--hue) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          'ZenMaruGothic-Medium',
          '萝莉体 第二版',
          'Roboto',
          'sans-serif',
          // ... 更多回退字体
        ],
      },
      borderRadius: {
        'large': '1rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '70': '17.5rem',
        '90': '22.5rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-in forwards',
      },
      // ... 更多配置
    },
  },
  plugins: [],
}
```

### 4.2 postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4.3 style.css (CSS 变量)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --hue: 60;
    --radius-large: 1rem;
    --content-delay: 150ms;
    --page-width: 90rem;
    --banner-height: 35vh;
    --banner-height-home: 65vh;
    --sidebar-width: 17.5rem;
  }

  :root {
    --primary: oklch(0.70 0.14 var(--hue));
    --page-bg: oklch(0.95 0.01 var(--hue));
    --card-bg: white;
    /* ... 更多变量 */
  }

  .dark {
    --primary: oklch(0.75 0.14 var(--hue));
    --page-bg: oklch(0.16 0.014 var(--hue));
    --card-bg: oklch(0.23 0.015 var(--hue));
    /* ... 更多暗色模式变量 */
  }
}
```

---

## 五、MainLayout.vue 布局组件

### 5.1 组件结构

```
MainLayout.vue
├── Header (固定导航栏)
│   ├── Logo
│   ├── Navigation Links
│   ├── Dark Mode Toggle
│   └── Mobile Menu Toggle
├── Main Content (slot)
└── Footer
    ├── Copyright
    ├── Links
    └── Powered By
```

### 5.2 关键特性

1. **响应式导航**: 桌面端显示完整导航，移动端显示汉堡菜单
2. **暗色模式**: 点击按钮切换亮色/暗色主题，状态保存到 localStorage
3. **滚动效果**: 滚动时导航栏添加背景模糊和阴影
4. **回到顶部**: 滚动超过一定距离后显示回到顶部按钮

### 5.3 "呼吸感"布局实现

```vue
<!-- 导航栏间距 -->
<header class="py-4">  <!-- 默认上下 16px 间距 -->
  <nav class="px-4">   <!-- 左右 16px 内边距 -->
    <div class="h-12"> <!-- 导航高度 48px -->
      <!-- 内容 -->
    </div>
  </nav>
</header>

<!-- 主内容区域 -->
<main class="pt-22">  <!-- 顶部预留 88px 给固定导航栏 -->
  <div class="max-w-[var(--page-width)] mx-auto px-4 py-8">
    <!-- 内容宽度最大 90rem，居中，左右内边距 16px，上下内边距 32px -->
  </div>
</main>

<!-- 卡片组件 -->
<div class="card-base p-8">  <!-- 卡片内边距 32px -->
  <h1 class="mb-4">          <!-- 标题下方间距 16px -->
  <p class="mb-6">           <!-- 段落下方间距 24px -->
</div>

<!-- 网格布局 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 卡片之间间距 24px -->
</div>
```

**呼吸感设计原则**:
- **充足留白**: 使用 `p-8` (32px)、`py-8` (32px)、`gap-6` (24px) 等较大间距
- **渐进间距**: 标题 `mb-4` (16px) < 段落 `mb-6` (24px) < 卡片 `gap-6` (24px)
- **圆角柔和**: 使用 `rounded-large` (1rem) 圆角
- **过渡动画**: 所有颜色变化使用 `duration-150` (150ms) 过渡

---

## 六、启动项目

### 6.1 开发模式

```powershell
cd d:\MizukiCode\myblog-vue-front
npm run dev
```

访问: http://localhost:5173/

### 6.2 构建生产版本

```powershell
npm run build
```

### 6.3 预览生产版本

```powershell
npm run preview
```

---

## 七、文件清单

### 7.1 新建文件

| 文件路径 | 说明 |
|----------|------|
| `tailwind.config.js` | Tailwind CSS 配置 |
| `postcss.config.js` | PostCSS 配置 |
| `src/style.css` | 全局样式和 CSS 变量 |
| `src/layouts/MainLayout.vue` | 主布局组件 |
| `src/App.vue` | 根组件 |
| `src/main.js` | 入口文件 |
| `index.html` | HTML 模板 |

### 7.2 迁移的素材文件

| 文件路径 | 说明 |
|----------|------|
| `public/assets/home/default-logo.png` | 网站 Logo |
| `public/assets/home/home.png` | 导航图标 |
| `public/favicon/favicon.ico` | 网站图标 |
| `src/assets/images/avatar.webp` | 默认头像 |
| `src/assets/fonts/ZenMaruGothic-Medium.ttf` | 主字体 |
| `src/assets/fonts/萝莉体 第二版.ttf` | 辅助字体 |
| `public/assets/desktop-banner/*.webp` | 桌面端 Banner (6张) |
| `public/assets/mobile-banner/*.webp` | 移动端 Banner (6张) |

---

## 八、下一步计划

1. **路由配置**: 安装 Vue Router，配置页面路由
2. **API 服务**: 配置 Axios，创建 API 服务层
3. **页面开发**: 开发首页、文章列表、文章详情等页面
4. **组件开发**: 开发文章卡片、分页、标签云等组件

---

*文档生成完毕，项目初始化完成。*
