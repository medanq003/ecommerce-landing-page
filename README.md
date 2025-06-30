# 电商培训课程中转落地页

## 项目概述

这是一个专为电商培训课程设计的中转落地页，主要用于过滤无效流量并引导高质量用户到核心转化页面。

## 功能特性

### 核心功能
- ✅ 智能流量过滤系统（机器人检测）
- ✅ 主跳转功能（CTA按钮）
- ✅ 备用跳转机制（离页跳转、后退跳转）
- ✅ 延迟加载CTA（防机器人）

### 内容功能
- ✅ 电商培训课程介绍
- ✅ 价值主张展示
- ✅ 稀缺感和紧迫感文案
- ✅ 社会证明（学员案例）
- ✅ 倒计时器

### 技术功能
- ✅ SEO控制（禁止索引）
- ✅ 数据追踪（Google Analytics, Facebook Pixel）
- ✅ 响应式设计
- ✅ 性能优化

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: CSS Grid, Flexbox, CSS动画
- **分析**: Google Analytics, Facebook Pixel
- **部署**: 静态网站托管（Cloudflare Pages, Netlify, GitHub Pages等）

## 文件结构

```
├── index.html          # 主页面
├── styles/
│   └── main.css       # 主样式文件
├── scripts/
│   └── main.js        # 主JavaScript文件
├── README.md          # 项目说明
└── PRD_中转落地页.md   # 产品需求文档
```

## 部署说明

### 快速部署到静态托管服务

1. **Netlify**
   - 将项目文件夹拖拽到 Netlify 部署页面
   - 或连接 GitHub 仓库自动部署

2. **Cloudflare Pages**
   - 连接 GitHub 仓库
   - 设置构建命令为空（静态文件）

3. **GitHub Pages**
   - 推送代码到 GitHub 仓库
   - 在仓库设置中启用 GitHub Pages

4. **Render**
   - 连接 GitHub 仓库
   - 选择静态网站部署

## 配置说明

### 分析工具配置

1. **Google Analytics**
   - 在 `scripts/main.js` 中替换 `GA_MEASUREMENT_ID` 为实际的测量ID
   
2. **Facebook Pixel**
   - 在 `scripts/main.js` 中替换 `FACEBOOK_PIXEL_ID` 为实际的像素ID

### 目标URL配置

- 在 `scripts/main.js` 中修改 `targetUrl` 变量为实际的转化页面URL

## 性能指标

- 页面加载时间: < 3秒 (3G网络)
- PageSpeed Insights 移动端得分: ≥ 85分
- 目标CTR: > 40%
- 机器人过滤率: > 80%

## 安全特性

- 机器人检测和过滤
- 用户行为验证
- 链接混淆处理
- 防止直接访问核心域名

## 浏览器兼容性

- Chrome (最新版本)
- Safari (最新版本)
- Firefox (最新版本)
- Edge (最新版本)
- 移动端浏览器

## 开发说明

项目采用原生JavaScript开发，无需构建工具，可直接在浏览器中运行。

### 本地开发

1. 克隆或下载项目文件
2. 使用本地服务器运行（如 Live Server 扩展）
3. 在浏览器中访问 `http://localhost:端口号`

### 自定义修改

- 修改 `index.html` 调整页面内容
- 修改 `styles/main.css` 调整样式
- 修改 `scripts/main.js` 调整功能逻辑

## 许可证

本项目仅供学习和商业使用。
