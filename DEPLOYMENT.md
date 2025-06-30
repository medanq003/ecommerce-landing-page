# 部署指南

## 快速部署

### 1. Netlify 部署（推荐）

1. **准备代码**
   ```bash
   # 确保所有文件都在项目根目录
   ls -la
   # 应该看到: index.html, styles/, scripts/, config/, etc.
   ```

2. **部署到 Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 点击 "Add new site" > "Deploy manually"
   - 将整个项目文件夹拖拽到部署区域
   - 等待部署完成

3. **配置自定义域名**（可选）
   - 在 Netlify 控制台中点击 "Domain settings"
   - 添加自定义域名
   - 配置 DNS 记录

### 2. Cloudflare Pages 部署

1. **GitHub 集成**
   ```bash
   # 将代码推送到 GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/landing-page.git
   git push -u origin main
   ```

2. **连接 Cloudflare Pages**
   - 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
   - 连接 GitHub 仓库
   - 构建设置：
     - 构建命令：留空（静态文件）
     - 构建输出目录：`/`

### 3. GitHub Pages 部署

1. **启用 GitHub Pages**
   - 在 GitHub 仓库设置中找到 "Pages"
   - 选择 "Deploy from a branch"
   - 选择 `main` 分支和 `/ (root)` 目录

2. **自定义域名**（可选）
   - 在仓库根目录创建 `CNAME` 文件
   - 内容为你的域名，如：`example.com`

### 4. Render 部署

1. **连接仓库**
   - 访问 [render.com](https://render.com)
   - 选择 "New Static Site"
   - 连接 GitHub 仓库

2. **配置设置**
   - 构建命令：留空
   - 发布目录：`.`

## 配置说明

### 1. 分析工具配置

编辑 `config/analytics.js` 文件：

```javascript
const ANALYTICS_CONFIG = {
    googleAnalytics: {
        enabled: true,
        measurementId: 'G-XXXXXXXXXX', // 替换为你的 GA4 ID
    },
    facebookPixel: {
        enabled: true,
        pixelId: '1234567890123456', // 替换为你的 Facebook Pixel ID
    }
};
```

### 2. 目标 URL 配置

编辑 `scripts/main.js` 文件第4行：

```javascript
this.targetUrl = 'https://your-target-domain.com'; // 替换为实际的转化页面
```

### 3. 域名和 HTTPS

确保部署后：
- 启用 HTTPS（所有推荐的平台都自动提供）
- 配置自定义域名（如果需要）
- 测试所有重定向功能

## 性能优化检查

### 1. PageSpeed Insights 测试

部署后访问：
- [PageSpeed Insights](https://pagespeed.web.dev/)
- 输入你的网站 URL
- 确保移动端得分 ≥ 85

### 2. Core Web Vitals 检查

确保以下指标达标：
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 3. 移动端测试

使用以下工具测试移动端性能：
- Chrome DevTools 移动端模拟
- 实际移动设备测试
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## 安全配置

### 1. HTTP 安全头

在部署平台添加以下安全头：

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.googletagmanager.com *.facebook.net; style-src 'self' 'unsafe-inline'
```

### 2. 机器人防护

确保以下功能正常工作：
- User-Agent 检测
- 行为模式分析
- IP 过滤（如果配置）

## 监控和分析

### 1. 设置监控

- 配置 Google Analytics 4
- 设置 Facebook Pixel
- 启用错误监控（如 Sentry）

### 2. 关键指标监控

监控以下指标：
- 页面浏览量 (PV)
- 点击率 (CTR)
- 转化率
- 跳出率
- 页面加载时间

### 3. A/B 测试

考虑测试以下元素：
- CTA 按钮文案
- 价格展示方式
- 紧迫感文案
- 页面布局

## 故障排除

### 1. 常见问题

**问题：CTA 按钮不工作**
- 检查 JavaScript 是否正确加载
- 确认没有 JavaScript 错误
- 验证目标 URL 是否正确

**问题：分析数据不显示**
- 确认 Analytics ID 配置正确
- 检查是否被广告拦截器阻止
- 验证网络请求是否成功

**问题：页面加载慢**
- 检查图片是否优化
- 确认 CDN 配置
- 验证缓存策略

### 2. 调试工具

使用浏览器开发者工具：
- Network 标签：检查资源加载
- Console 标签：查看 JavaScript 错误
- Performance 标签：分析性能瓶颈

### 3. 测试清单

部署前检查：
- [ ] 所有链接正常工作
- [ ] 移动端显示正常
- [ ] 分析代码正确配置
- [ ] 性能指标达标
- [ ] 安全头配置完成
- [ ] 机器人防护启用

## 维护建议

### 1. 定期更新

- 每月检查性能指标
- 更新安全配置
- 优化转化率

### 2. 内容更新

- 更新学员案例
- 调整价格和优惠
- 优化文案内容

### 3. 技术维护

- 监控错误日志
- 更新依赖库
- 备份重要数据

## 扩展功能

### 1. 高级分析

- 集成 Hotjar 热力图
- 添加用户录屏
- 设置转化漏斗分析

### 2. 个性化

- 基于地理位置的内容
- 基于设备类型的优化
- 动态价格显示

### 3. 营销自动化

- 邮件营销集成
- 重定向广告像素
- 客户关系管理系统集成

---

**注意**：部署前请确保已经测试所有功能，并且已经配置好分析工具和目标 URL。
