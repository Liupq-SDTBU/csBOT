/**
 * Vercel Serverless Function - 认证接口
 * 路径: /api/auth
 * 方法: POST
 */

// 用户凭证配置（在后端存储，不暴露给前端）
const USER_CREDENTIALS = {
    'admin': '21232f297a57a5a743894a0e4a801fc3',  // admin 的 MD5
    'teacher': '5f4dcc3b5aa765d61d8327deb882cf99',  // teacher 的 MD5
    'student': 'e10adc3949ba59abbe56e057f20f883e'   // student 的 MD5
};

// 扣子BOT私有访问链接（在后端配置）
const BOT_PRIVATE_URLS = {
    'admin': process.env.BOT_URL_ADMIN || 'https://www.coze.cn/store/bot/738219342852?bid=73829472384',
    'teacher': process.env.BOT_URL_TEACHER || 'https://www.coze.cn/store/bot/738219342852?bid=73829472384',
    'student': process.env.BOT_URL_STUDENT || 'https://www.coze.cn/store/bot/738219342852?bid=73829472384'
};

export default function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    try {
        const { username, password } = req.body;

        // 验证输入
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '请输入用户名和密码' 
            });
        }

        // 计算密码的 MD5 哈希值
        const crypto = require('crypto');
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        // 验证用户凭证
        if (USER_CREDENTIALS[username] && USER_CREDENTIALS[username] === hashedPassword) {
            // 认证成功
            return res.status(200).json({ 
                success: true, 
                message: '登录成功',
                redirectUrl: BOT_PRIVATE_URLS[username] || BOT_PRIVATE_URLS['admin']
            });
        } else {
            // 认证失败
            return res.status(401).json({ 
                success: false, 
                message: '用户名或密码错误' 
            });
        }

    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ 
            success: false, 
            message: '服务器错误，请稍后重试' 
        });
    }
}
