# Astro 项目视觉基因与素材审计报告

> 审计日期: 2026-03-19  
> 项目路径: `d:\MizukiCode\mizuki`

---

## 一、视觉基因审计

### 1.1 Tailwind CSS 配置

项目使用 **Tailwind CSS v4** (通过 `@tailwindcss/vite` 插件集成)，采用新的 CSS-first 配置方式。

#### 核心配置 (`src/styles/main.css`)

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
@custom-variant dark (&:where(.dark, .dark *));
```
你现在是全栈架构师。请深入阅读 astro项目源代码 文件夹。
任务要求：

审计视觉基因： 分析其 Tailwind 配置、CSS 变量、字体、间距以及“呼吸感”布局的实现方式。

素材清单： 找出项目中所有的静态图片（Logo、默认头像、文章封面占位图等），记录它们的原始路径。

生成文档： 在 myblog-vue-front 文件夹下生成 01_STYLE_AND_ASSETS_REPORT.md。

详细列出颜色规范（Hex码）、间距规范。

列出建议从 Astro 拷贝到 Vue 项目中的图片文件清单。

请先向我提交这份审计报告。
#### 自定义主题配置 (`@theme`)

| 配置项 | 值 |
|--------|-----|
| `--font-sans` | `'Roboto', 'sans-serif', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` |
| `--breakpoint-md` | `768px` |
| `--breakpoint-lg` | `1280px` |
| `--breakpoint-xl` | `1920px` |

#### 自定义工具类 (`@utility`)

```css
@utility expand-animation {
  @apply relative before:ease-out before:duration-75 before:transition-all 
         active:bg-none hover:before:bg-(--btn-plain-bg-hover) 
         active:before:bg-(--btn-plain-bg-active) z-0
         before:absolute before:rounded-[inherit] before:inset-0 
         before:scale-[0.85] hover:before:scale-100 before:-z-10;
}
```

---

### 1.2 CSS 变量系统 (`src/styles/variables.styl`)

项目采用 **OKLCH 色彩空间**，支持动态主题色相调整 (`--hue` 变量)。

#### 核心颜色变量 (亮色/暗色双模式)

| 变量名 | 亮色模式 | 暗色模式 | 说明 |
|--------|----------|----------|------|
| `--primary` | `oklch(0.70 0.14 var(--hue))` | `oklch(0.75 0.14 var(--hue))` | 主题色 |
| `--page-bg` | `oklch(0.95 0.01 var(--hue))` | `oklch(0.16 0.014 var(--hue))` | 页面背景 |
| `--card-bg` | `white` | `oklch(0.23 0.015 var(--hue))` | 卡片背景 |
| `--card-bg-transparent` | `rgba(255, 255, 255, 0.8)` | `rgba(23, 23, 23, 0.8)` | 透明卡片背景 |
| `--btn-content` | `oklch(0.55 0.12 var(--hue))` | `oklch(0.75 0.1 var(--hue))` | 按钮文字色 |
| `--btn-regular-bg` | `oklch(0.95 0.025 var(--hue))` | `oklch(0.33 0.035 var(--hue))` | 常规按钮背景 |
| `--btn-regular-bg-hover` | `oklch(0.9 0.05 var(--hue))` | `oklch(0.38 0.04 var(--hue))` | 按钮悬停背景 |
| `--btn-regular-bg-active` | `oklch(0.85 0.08 var(--hue))` | `oklch(0.43 0.045 var(--hue))` | 按钮激活背景 |
| `--btn-plain-bg-hover` | `oklch(0.95 0.025 var(--hue))` | `oklch(0.30 0.035 var(--hue))` | 朴素按钮悬停 |
| `--btn-plain-bg-active` | `oklch(0.98 0.01 var(--hue))` | `oklch(0.27 0.025 var(--hue))` | 朴素按钮激活 |
| `--btn-card-bg-hover` | `oklch(0.98 0.005 var(--hue))` | `oklch(0.3 0.03 var(--hue))` | 卡片按钮悬停 |
| `--btn-card-bg-active` | `oklch(0.9 0.03 var(--hue))` | `oklch(0.35 0.035 var(--hue))` | 卡片按钮激活 |
| `--deep-text` | `oklch(0.25 0.02 var(--hue))` | - | 深色文字 |
| `--title-active` | `oklch(0.6 0.1 var(--hue))` | - | 标题激活色 |
| `--line-divider` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` | 分隔线 |
| `--line-color` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.1)` | 线条颜色 |
| `--meta-divider` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.2)` | 元数据分隔符 |
| `--content-meta` | `rgba(0, 0, 0, 0.7)` | `rgba(255, 255, 255, 0.6)` | 内容元数据 |
| `--selection-bg` | `oklch(0.90 0.05 var(--hue))` | `oklch(0.40 0.08 var(--hue))` | 选中背景 |
| `--codeblock-bg` | `oklch(0.97 0.005 var(--hue))` | `oklch(0.17 0.015 var(--hue))` | 代码块背景 |
| `--codeblock-topbar-bg` | `oklch(0.94 0.01 var(--hue))` | `oklch(0.12 0.015 var(--hue))` | 代码块顶栏 |
| `--link-underline` | `oklch(0.93 0.04 var(--hue))` | `oklch(0.40 0.08 var(--hue))` | 链接下划线 |
| `--link-hover` | `oklch(0.95 0.025 var(--hue))` | `oklch(0.40 0.08 var(--hue))` | 链接悬停 |
| `--link-active` | `oklch(0.90 0.05 var(--hue))` | `oklch(0.35 0.07 var(--hue))` | 链接激活 |
| `--float-panel-bg` | `white` | `oklch(0.19 0.015 var(--hue))` | 浮动面板背景 |

#### 滚动条变量

| 变量名 | 亮色模式 | 暗色模式 |
|--------|----------|----------|
| `--scrollbar-bg-light` | `rgba(0, 0, 0, 0.4)` | - |
| `--scrollbar-bg-hover-light` | `rgba(0, 0, 0, 0.5)` | - |
| `--scrollbar-bg-active-light` | `rgba(0, 0, 0, 0.6)` | - |
| `--scrollbar-bg-dark` | - | `rgba(255, 255, 255, 0.4)` |
| `--scrollbar-bg-hover-dark` | - | `rgba(255, 255, 255, 0.5)` |
| `--scrollbar-bg-active-dark` | - | `rgba(255, 255, 255, 0.6)` |

#### 提示框颜色 (Admonitions)

| 类型 | 亮色模式 | 暗色模式 |
|------|----------|----------|
| `--admonitions-color-tip` | `oklch(0.7 0.14 180)` | `oklch(0.75 0.14 180)` |
| `--admonitions-color-note` | `oklch(0.7 0.14 250)` | `oklch(0.75 0.14 250)` |
| `--admonitions-color-important` | `oklch(0.7 0.14 310)` | `oklch(0.75 0.14 310)` |
| `--admonitions-color-warning` | `oklch(0.7 0.14 60)` | `oklch(0.75 0.14 60)` |
| `--admonitions-color-caution` | `oklch(0.6 0.2 25)` | `oklch(0.65 0.2 25)` |

#### 布局变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `--radius-large` | `1rem` | 大圆角半径 |
| `--content-delay` | `150ms` | 内容延迟 |
| `--toc-width` | `calc((100vw - var(--page-width)) / 2 - 1rem)` | 目录宽度 |

---

### 1.3 字体配置

#### 自定义字体 (`src/styles/main.css`)

```css
@font-face {
  font-family: "ZenMaruGothic-Medium";
  src: url("/assets/font/ZenMaruGothic-Medium.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: "萝莉体 第二版";
  src: url("/assets/font/萝莉体 第二版.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

#### 字体配置 (`src/config.ts`)

| 配置项 | 值 |
|--------|-----|
| ASCII 字体 | `ZenMaruGothic-Medium` (优先级最高) |
| CJK 字体 | `萝莉体 第二版` (回退字体) |
| 代码字体 | `'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` |

#### 字体文件路径

| 字体 | 原始路径 |
|------|----------|
| ZenMaruGothic-Medium | `public/assets/font/ZenMaruGothic-Medium.ttf` |
| 萝莉体 第二版 | `public/assets/font/萝莉体 第二版.ttf` |

---

### 1.4 间距规范

#### Tailwind 间距扩展

项目使用 Tailwind 默认间距系统，关键间距值：

| 类名 | 值 | 用途 |
|------|-----|------|
| `p-1` | `0.25rem` (4px) | 小内边距 |
| `p-1.5` | `0.375rem` (6px) | 中小内边距 |
| `p-2` | `0.5rem` (8px) | 标准内边距 |
| `p-4` | `1rem` (16px) | 大内边距 |
| `gap-0.5` | `0.125rem` (2px) | 小间隙 |
| `gap-1` | `0.25rem` (4px) | 标准间隙 |
| `gap-2` | `0.5rem` (8px) | 中等间隙 |
| `gap-4` | `1rem` (16px) | 大间隙 |
| `gap-6` | `1.5rem` (24px) | 网格布局间隙 |

#### 响应式断点

| 断点 | 宽度 | 说明 |
|------|------|------|
| `mobile` | `< 768px` | 移动端 |
| `tablet` | `768px - 1279px` | 平板端 |
| `desktop` | `>= 1280px` | 桌面端 |
| `xl` | `>= 1920px` | 大屏 |

#### 布局常量 (`src/constants/constants.ts`)

| 常量 | 值 | 说明 |
|------|-----|------|
| `PAGE_SIZE` | `8` | 每页文章数 |
| `BANNER_HEIGHT` | `35` | Banner 高度 (vh) |
| `BANNER_HEIGHT_EXTEND` | `30` | Banner 扩展高度 (vh) |
| `BANNER_HEIGHT_HOME` | `65` | 首页 Banner 总高度 (vh) |
| `MAIN_PANEL_OVERLAPS_BANNER_HEIGHT` | `3.5` | 主面板与 Banner 重叠高度 (rem) |
| `PAGE_WIDTH` | `90` | 页面宽度 (rem) |

---

### 1.5 "呼吸感"布局实现

#### 核心设计原则

1. **充足的留白空间**
   - 卡片间距: `gap-4` (1rem) 到 `gap-6` (1.5rem)
   - 组件内边距: `p-4` 到 `p-6`
   - 侧边栏宽度: `17.5rem` (280px)

2. **圆角设计**
   - 统一使用 `--radius-large: 1rem` (16px)
   - 卡片、按钮、面板均采用大圆角

3. **透明度与模糊**
   - 全屏壁纸模式下: `backdrop-filter: blur(8px)`
   - 导航栏透明模式: `backdrop-filter: blur(20px)`
   - 卡片透明背景: `rgba(255, 255, 255, 0.8)` / `rgba(23, 23, 23, 0.8)`

4. **渐变过渡**
   - 页面顶部高光: `linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)`
   - 代码块折叠渐变: `linear-gradient(to bottom, transparent 0%, var(--codeblock-bg) 90%)`

5. **动画缓动**
   - 标准过渡: `cubic-bezier(0.4, 0, 0.2, 1)`
   - 进入动画: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
   - 离开动画: `cubic-bezier(0.55, 0.055, 0.675, 0.19)`

#### 网格布局 (`src/layouts/MainGridLayout.astro`)

```css
/* 三栏布局 */
lg:grid-cols-[17.5rem_1fr_17.5rem]

/* 双栏布局 */
lg:grid-cols-[17.5rem_1fr]
lg:grid-cols-[1fr_17.5rem]

/* 单栏布局 */
lg:grid-cols-1
```

---

### 1.6 动画系统

#### 页面过渡动画 (`src/styles/transition.css`)

| 动画类型 | 持续时间 | 缓动函数 |
|----------|----------|----------|
| 页面进入 | `300ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| 页面离开 | `300ms` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` |
| 组件加载 | `300ms` | `ease-out` |

#### 组件动画 (`src/styles/animation-enhancements.css`)

| 组件 | 动画效果 | 持续时间 |
|------|----------|----------|
| 卡片 | `translateY(2rem) scale(0.95)` → 正常 | `400ms` |
| 侧边栏 | `translateX(-2rem)` → 正常 | `300ms` |
| 导航栏 | `translateY(-1rem)` → 正常 | `280ms` |
| 按钮 | `translateY(-2px)` + 阴影增强 | `200ms` |
| 图片 | `scale(1.05)` → `scale(1)` | `400ms` |

---

## 二、素材清单

### 2.1 核心图片资源

#### Logo 与品牌

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `default-logo.png` | `public/assets/home/default-logo.png` | 网站 Logo | ✅ 必需 |
| `home.png` | `public/assets/home/home.png` | 导航栏图标 | ✅ 必需 |
| `logo.png` | `mizuki/logo.png` | 项目 Logo | ✅ 必需 |
| `favicon.ico` | `public/favicon/favicon.ico` | 网站图标 | ✅ 必需 |

#### 头像

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `avatar.webp` | `src/assets/images/avatar.webp` | 用户头像 | ✅ 必需 |
| `avatar.jpg` | `public/pio/static/avatar.jpg` | 看板娘默认头像 | ⚠️ 可选 |

#### Banner 图片

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `1.webp` - `6.webp` | `public/assets/desktop-banner/` | 桌面端 Banner | ✅ 必需 |
| `1.webp` - `6.webp` | `public/assets/mobile-banner/` | 移动端 Banner | ✅ 必需 |

#### 文章封面占位图

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `cover.webp` | `src/content/posts/guide/cover.webp` | 示例文章封面 | ⚠️ 可选 |

#### 特效图片

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `sakura.png` | `public/sakura.png` | 樱花特效 | ⚠️ 可选 |

---

### 2.2 看板娘资源 (Pio)

| 文件夹 | 原始路径 | 内容 | 建议迁移 |
|--------|----------|------|----------|
| `textures/` | `public/pio/models/pio/textures/` | 服装纹理 (3个PNG) | ⚠️ 可选 |
| `motions/` | `public/pio/models/pio/motions/` | 动作文件 (25个MTN) | ⚠️ 可选 |
| `model.json` | `public/pio/models/pio/model.json` | 模型配置 | ⚠️ 可选 |
| `model.moc` | `public/pio/models/pio/model.moc` | 模型数据 | ⚠️ 可选 |

---

### 2.3 音乐播放器资源

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `cl.jpg` | `public/assets/music/cover/cl.jpg` | 音乐封面 | ⚠️ 可选 |
| `hitori.jpg` | `public/assets/music/cover/hitori.jpg` | 音乐封面 | ⚠️ 可选 |
| `xryx.jpg` | `public/assets/music/cover/xryx.jpg` | 音乐封面 | ⚠️ 可选 |

---

### 2.4 番剧页面图片

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `cmmn.webp` | `public/assets/anime/cmmn.webp` | 番剧封面 | ⚠️ 可选 |
| `laxxx.webp` | `public/assets/anime/laxxx.webp` | 番剧封面 | ⚠️ 可选 |
| `lkls.webp` | `public/assets/anime/lkls.webp` | 番剧封面 | ⚠️ 可选 |
| `rynh.webp` | `public/assets/anime/rynh.webp` | 番剧封面 | ⚠️ 可选 |
| `tz1.webp` | `public/assets/anime/tz1.webp` | 番剧封面 | ⚠️ 可选 |

---

### 2.5 相册示例图片

| 文件夹 | 原始路径 | 文件数 | 建议迁移 |
|--------|----------|--------|----------|
| `AcgExample/` | `public/images/albums/AcgExample/` | 约30张图片 | ❌ 不迁移 |

---

### 2.6 字体文件

| 文件名 | 原始路径 | 用途 | 建议迁移 |
|--------|----------|------|----------|
| `ZenMaruGothic-Medium.ttf` | `public/assets/font/` | ASCII 字体 | ✅ 必需 |
| `萝莉体 第二版.ttf` | `public/assets/font/` | CJK 字体 | ✅ 必需 |

---

## 三、迁移建议清单

### 3.1 必须迁移的资源

```
public/assets/home/default-logo.png     → Vue 项目 Logo
public/assets/home/home.png             → Vue 项目导航图标
public/favicon/favicon.ico              → Vue 项目图标
src/assets/images/avatar.webp           → Vue 项目默认头像
public/assets/font/ZenMaruGothic-Medium.ttf  → Vue 项目字体
public/assets/font/萝莉体 第二版.ttf    → Vue 项目字体
public/assets/desktop-banner/*.webp     → Vue 项目 Banner (6张)
public/assets/mobile-banner/*.webp      → Vue 项目 Banner (6张)
```

### 3.2 可选迁移的资源

```
public/sakura.png                       → 樱花特效 (如需要)
public/pio/                             → 看板娘完整资源 (如需要)
public/assets/music/                    → 音乐播放器资源 (如需要)
public/assets/anime/                    → 番剧封面 (如需要)
```

### 3.3 不建议迁移的资源

```
public/images/albums/                   → 相册示例图片 (用户自行上传)
docs/image/                             → 文档图片
README.webp                             → README 图片
```

---

## 四、颜色规范速查表

### 4.1 主题色系 (默认 hue=60, 黄色)

| 颜色名称 | OKLCH 值 | 近似 Hex | 用途 |
|----------|----------|----------|------|
| Primary | `oklch(0.70 0.14 60)` | `#E5A800` | 主题色 |
| Primary Dark | `oklch(0.75 0.14 60)` | `#FFB800` | 暗色模式主题色 |
| Page BG Light | `oklch(0.95 0.01 60)` | `#FAF8F0` | 亮色背景 |
| Page BG Dark | `oklch(0.16 0.014 60)` | `#1A1A18` | 暗色背景 |
| Card BG Light | `white` | `#FFFFFF` | 亮色卡片 |
| Card BG Dark | `oklch(0.23 0.015 60)` | `#252520` | 暗色卡片 |

### 4.2 功能色

| 颜色名称 | OKLCH 值 | 近似 Hex | 用途 |
|----------|----------|----------|------|
| Tip | `oklch(0.7 0.14 180)` | `#00A896` | 提示信息 |
| Note | `oklch(0.7 0.14 250)` | `#4A7CFF` | 注释信息 |
| Important | `oklch(0.7 0.14 310)` | `#B44AFF` | 重要信息 |
| Warning | `oklch(0.7 0.14 60)` | `#E5A800` | 警告信息 |
| Caution | `oklch(0.6 0.2 25)` | `#E53500` | 危险信息 |

---

## 五、间距规范速查表

| 类别 | 值 | 使用场景 |
|------|-----|----------|
| 圆角 | `1rem (16px)` | 卡片、按钮、面板 |
| 卡片间距 | `0.75rem - 1rem` | 列表/网格布局 |
| 组件内边距 | `1rem - 1.5rem` | 卡片内容区域 |
| 侧边栏宽度 | `17.5rem (280px)` | 左右侧边栏 |
| 页面宽度 | `90rem (1440px)` | 最大内容宽度 |
| Banner 高度 | `35vh` | 普通 Banner |
| Banner 高度 (首页) | `65vh` | 首页扩展 Banner |

---

## 六、动画规范速查表

| 动画类型 | 持续时间 | 缓动函数 | 用途 |
|----------|----------|----------|------|
| 快速过渡 | `75ms` | `ease-out` | 按钮展开 |
| 标准过渡 | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 颜色变化 |
| 页面过渡 | `300ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 页面切换 |
| 组件进入 | `350ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 组件加载 |
| 卡片动画 | `400ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 卡片悬停 |

---

*报告生成完毕，请审阅后确认迁移方案。*
