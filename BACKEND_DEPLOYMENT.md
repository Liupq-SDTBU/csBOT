# 后端验证模式部署指南

## 📋 部署架构对比

| 特性 | 前端验证（旧方案） | 后端验证（新方案） |
|------|------------------|------------------|
| **安全性** | ❌ 低（密码在客户端可见） | ✅ 高（密码在后端验证） |
| **部署平台** | 任意静态托管（GitHub Pages/Vercel） | Vercel（Serverless Function） |
| **开发复杂度** | 简单 | 稍复杂 |
| **维护成本** | 低（无需服务器） | 低（Serverless 自动扩展） |
| **适用场景** | 内部工具、非敏感系统 | 生产环境、需要认证的系统 |

---

## 🚀 快速部署（Vercel）

### 第一步：准备代码文件

确保你的项目结构如下：

```
your-project/
├── api/
│   └── auth.js          # 后端验证函数
├── public/              # 静态文件（可选）
│   ├── index.html
│   ├── md5.js
│   ├── config.js
│   └── app.js
├── package.json
├── vercel.json
└── README.md
```

**如果没有 public 目录**，直接将静态文件放在根目录即可。

---

### 第二步：配置 Vercel 环境变量（推荐）

在 Vercel 项目设置中添加以下环境变量：

**路径**：Vercel Dashboard → 你的项目 → Settings → Environment Variables

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `BOT_URL_ADMIN` | 管理员用户对应的BOT链接 | `https://www.coze.cn/store/bot/738219342852?bid=73829472384` |
| `BOT_URL_TEACHER` | 教师用户对应的BOT链接 | `https://www.coze.cn/store/bot/738219342852?bid=73829472384` |
| `BOT_URL_STUDENT` | 学生用户对应的BOT链接 | `https://www.coze.cn/store/bot/738219342852?bid=73829472384` |

**优势**：
- ✅ 敏感信息不暴露在代码中
- ✅ 不同环境（开发/生产）可以使用不同的配置
- ✅ 修改配置无需重新部署代码

---

### 第三步：部署到 Vercel

#### 方法 1：通过 Git 部署（推荐）

1. **提交代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Add backend authentication system"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问：https://vercel.com/new
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

3. **配置环境变量**
   - 部署完成后，点击项目设置
   - 进入 Settings → Environment Variables
   - 添加上述环境变量
   - 重新部署（点击 "Redeploy"）

---

#### 方法 2：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

4. **添加环境变量**
   ```bash
   vercel env add BOT_URL_ADMIN
   ```
   输入你的管理员BOT链接

5. **生产环境部署**
   ```bash
   vercel --prod
   ```

---

### 第四步：测试部署

1. **访问部署后的网站**
   ```
   https://your-project.vercel.app
   ```

2. **测试登录**
   - 用户名：`admin`
   - 密码：`admin`

3. **查看调试信息**
   - 登录后会显示后端返回的跳转地址
   - 确认链接格式正确（`www.coze.cn/store/bot/...`）

4. **验证安全性**
   - 打开浏览器开发者工具（F12）
   - 查看 Network 标签
   - 确认密码是通过 POST 请求发送到 `/api/auth`
   - 确认前端代码中不再包含用户凭证

---

## 🔧 自定义配置

### 修改用户凭证

编辑 `api/auth.js` 文件中的 `USER_CREDENTIALS` 对象：

```javascript
const USER_CREDENTIALS = {
    'admin': '21232f297a57a5a743894a0e4a801fc3',      // admin 的 MD5
    'teacher': '5f4dcc3b5aa765d61d8327deb882cf99',    // teacher 的 MD5
    'student': 'e10adc3949ba59abbe56e057f20f883e',    // student 的 MD5
    'custom_user': 'custom_md5_hash_here'            // 自定义用户
};
```

**生成 MD5 哈希值**：
```javascript
// 在 Node.js 中生成
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('your_password').digest('hex');
console.log(hash);
```

---

### 修改 BOT 链接映射

编辑 `api/auth.js` 文件中的 `BOT_PRIVATE_URLS` 对象：

```javascript
const BOT_PRIVATE_URLS = {
    'admin': process.env.BOT_URL_ADMIN || 'https://www.coze.cn/store/bot/xxx?bid=xxx',
    'teacher': process.env.BOT_URL_TEACHER || 'https://www.coze.cn/store/bot/xxx?bid=xxx',
    'student': process.env.BOT_URL_STUDENT || 'https://www.coze.cn/store/bot/xxx?bid=xxx',
    'custom_user': 'https://www.coze.cn/store/bot/yyy?bid=yyy'
};
```

---

## 🔒 安全增强建议

### 1. 添加请求频率限制

修改 `api/auth.js`，添加频率限制：

```javascript
// 简单的内存存储（生产环境建议使用 Redis）
const rateLimit = {};

function checkRateLimit(ip) {
    const now = Date.now();
    const window = 60 * 1000; // 1分钟
    const maxRequests = 5;   // 最多5次请求

    if (!rateLimit[ip]) {
        rateLimit[ip] = { count: 0, resetTime: now + window };
    }

    // 重置计数器
    if (now > rateLimit[ip].resetTime) {
        rateLimit[ip] = { count: 0, resetTime: now + window };
    }

    rateLimit[ip].count++;

    if (rateLimit[ip].count > maxRequests) {
        return false;
    }

    return true;
}

// 在 handler 中使用
export default function handler(req, res) {
    // 获取客户端 IP
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 检查频率限制
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ 
            success: false, 
            message: '请求过于频繁，请稍后再试' 
        });
    }

    // ... 其余代码
}
```

---

### 2. 添加 CORS 保护

修改 `vercel.json`，添加 CORS 头：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

---

### 3. 添加日志记录

修改 `api/auth.js`，添加登录日志：

```javascript
// 记录登录日志
function logLogin(username, success, ip, userAgent) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${username} from ${ip} (${userAgent}) - ${success ? 'SUCCESS' : 'FAILED'}`);

    // 可以集成 Sentry、LogRocket 等日志服务
}

// 在 handler 中使用
export default function handler(req, res) {
    // ... 验证逻辑

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (success) {
        logLogin(username, true, ip, userAgent);
    } else {
        logLogin(username, false, ip, userAgent);
    }
}
```

---

### 4. 使用更安全的哈希算法

MD5 已经不再安全，建议使用 bcrypt 或 Argon2：

```bash
npm install bcryptjs
```

修改 `api/auth.js`：

```javascript
const bcrypt = require('bcryptjs');

// 生成哈希（运行一次，存储结果）
const saltRounds = 10;
const hashedPassword = bcrypt.hashSync('your_password', saltRounds);

// 验证密码
if (bcrypt.compareSync(password, USER_CREDENTIALS[username])) {
    // 密码正确
}
```

---

## 📊 监控与调试

### 查看日志

**Vercel Dashboard**：
1. 进入你的项目
2. 点击 "Logs" 标签
3. 查看实时日志

**Vercel CLI**：
```bash
vercel logs
```

### 查看函数调用

**Vercel Dashboard**：
1. 进入你的项目
2. 点击 "Functions" 标签
3. 查看 `/api/auth` 的调用情况

---

## 🎯 常见问题

### Q1：部署后登录报错 404

**原因**：API 路由没有正确配置

**解决**：
1. 确保 `api/auth.js` 文件在 `api/` 目录下
2. 确保 `vercel.json` 配置正确
3. 重新部署

---

### Q2：登录报错 500

**原因**：Serverless Function 执行出错

**解决**：
1. 查看 Vercel Logs 中的错误信息
2. 检查 `api/auth.js` 语法是否正确
3. 检查环境变量是否配置

---

### Q3：如何修改密码？

**步骤**：
1. 生成新密码的 MD5 哈希值
2. 修改 `api/auth.js` 中的 `USER_CREDENTIALS`
3. 重新部署

**生成 MD5**：
```javascript
const crypto = require('crypto');
const hash = crypto.createHash('md5').update('new_password').digest('hex');
console.log(hash);
```

---

### Q4：如何添加新用户？

**步骤**：
1. 在 `api/auth.js` 的 `USER_CREDENTIALS` 中添加新用户
2. 在 `BOT_PRIVATE_URLS` 中添加对应的 BOT 链接
3. 重新部署

**示例**：
```javascript
const USER_CREDENTIALS = {
    'admin': '21232f297a57a5a743894a0e4a801fc3',
    'new_user': 'new_hash_here'  // 添加新用户
};

const BOT_PRIVATE_URLS = {
    'admin': 'https://www.coze.cn/store/bot/xxx?bid=xxx',
    'new_user': 'https://www.coze.cn/store/bot/yyy?bid=yyy'  // 添加新链接
};
```

---

## 📚 参考资源

- [Vercel Serverless Functions 文档](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Node.js Crypto 文档](https://nodejs.org/api/crypto.html)
- [MD5 在线生成器](https://www.md5hashgenerator.com/)

---

## 🎉 完成

恭喜！你现在拥有了一个基于后端验证的安全登录系统。

**下一步**：
1. 部署到 Vercel
2. 配置环境变量
3. 测试登录功能
4. 根据需求进行安全增强
