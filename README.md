# 知识库问答系统 - 部署指南

## 📋 项目说明
这是一个基于扣子BOT的知识库问答系统的认证页面，通过用户名和密码保护访问。

## 🚀 快速开始

### 第一步：配置系统信息

1. 打开 `config.js` 文件
2. 修改 `BOT_PRIVATE_URL` 为你的扣子BOT私有访问链接
3. 根据需要修改用户凭证

#### 如何获取扣子BOT私有访问链接：
1. 在扣子平台创建你的BOT
2. 保持BOT为私有状态（不要发布到商店）
3. 点击BOT的"分享"按钮
4. 复制私有访问链接，格式如：`https://www.coze.cn/store/bot/xxx?bid=xxx`

#### 如何添加/修改用户：
在 `config.js` 中修改 `USER_CREDENTIALS` 对象：

```javascript
const USER_CREDENTIALS = {
    'admin': '0192023a7bbd73250516f069df18b500',  // 密码: admin123
    '新用户名': '密码的MD5哈希值'
};
```

#### 如何生成密码的MD5哈希值：
- 在线工具：https://www.md5hashgenerator.com/
- 或在部署后，按F12打开浏览器控制台，输入：
  ```javascript
  generateMD5('你的密码')
  ```

### 第二步：上传到 GitHub

1. 创建一个新的 GitHub 仓库
2. 将以下文件上传到仓库：
   - `index.html`
   - `md5.js`
   - `config.js`
   - `app.js`
   - `README.md`（本文件）

### 第三步：启用 GitHub Pages

1. 进入仓库页面
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Pages` 选项
4. 在 "Build and deployment" 部分中：
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main` (或 `master`)
   - 文件夹选择 `/ (root)`
5. 点击 `Save`

等待约 1-2 分钟，GitHub 会自动部署你的网站。

### 第四步：获取访问链接

部署成功后，GitHub Pages 会在页面顶部显示访问链接，格式如：
```
https://你的用户名.github.io/仓库名/
```

例如：`https://zhangsan.github.io/uni-knowledge-bot/`

将此链接分享给需要访问的师生即可。

---

## 🔐 默认账户信息

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | admin123 | 管理员账户 |
| teacher | password | 教师账户 |
| student | 123456 | 学生账户 |

⚠️ **重要提示**：部署到生产环境前，请务必修改默认密码！

---

## 📝 系统配置说明

### config.js 参数详解

```javascript
// 扣子BOT私有访问链接
const BOT_PRIVATE_URL = '你的BOT链接';

// 用户凭证（用户名: MD5哈希密码）
const USER_CREDENTIALS = {
    '用户名': '密码的MD5值'
};

// 其他配置
const CONFIG = {
    errorMessage: '登录失败提示信息',
    errorDisplayDuration: 3000,  // 错误提示显示时长(毫秒)
    clearPasswordOnError: true   // 错误时是否清除密码
};
```

---

## 🔧 自定义修改

### 修改页面样式
编辑 `index.html` 中的 `<style>` 部分，可以自定义：
- 页面背景色
- 登录框样式
- 按钮颜色
- 字体样式

### 修改页面标题
编辑 `index.html` 中的 `<title>` 标签和 `<h1>` 标签内容。

### 修改页脚信息
编辑 `index.html` 中的 `.footer` 部分。

---

## ⚠️ 安全注意事项

1. **密码安全**：
   - 虽然使用了MD5哈希存储密码，但这只是前端验证
   - 技术熟练的用户可以通过查看源代码绕过认证
   - 如需更高安全性，请使用后端验证方案

2. **仓库隐私**：
   - 建议将 GitHub 仓库设置为 Private
   - 即便仓库是私有的，GitHub Pages 仍然是公开访问的

3. **适用场景**：
   - 适合需要轻度访问控制的内部系统
   - 不适合存储极度敏感的信息

---

## 🐛 常见问题

### Q: 部署后无法访问？
A: 检查以下几点：
- GitHub Pages 是否已成功启用（等待 1-2 分钟）
- 仓库分支名称是否正确（main 或 master）
- 文件是否都在仓库根目录

### Q: 登录后没有跳转到BOT？
A: 检查 `config.js` 中的 `BOT_PRIVATE_URL` 是否正确填写。

### Q: 如何修改页面背景色？
A: 编辑 `index.html` 中的 body 样式：
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Q: 支持多人同时使用吗？
A: 支持，多个用户可以同时使用同一个BOT链接。

### Q: 可以限制IP地址吗？
A: GitHub Pages 本身不支持IP限制。如需IP白名单，建议使用 Cloudflare 等CDN服务。

---

## 📞 技术支持

如有问题，请联系系统管理员。

---

## 📄 许可证

仅供内部使用，禁止外传。

---

**部署日期**：2026年3月7日
**版本**：1.0.0
