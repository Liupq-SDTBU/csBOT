/**
 * 登录逻辑处理
 */

// 错误消息元素
const errorElement = document.getElementById('error-message');
const loginContainer = document.querySelector('.login-container');

// 显示错误消息
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // 添加抖动动画
    loginContainer.classList.add('shake');

    // 移除抖动动画
    setTimeout(() => {
        loginContainer.classList.remove('shake');
    }, 300);

    // 自动隐藏错误消息
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, CONFIG.errorDisplayDuration);
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // 验证输入是否为空
    if (!username || !password) {
        showError('请输入用户名和密码');
        return;
    }

    // 计算密码的MD5哈希值
    const hashedPassword = md5(password);

    // 验证用户凭证
    if (USER_CREDENTIALS[username] && USER_CREDENTIALS[username] === hashedPassword) {
        // 登录成功，跳转到BOT
        console.log('登录成功，用户:', username);

        // 检查是否配置了BOT链接
        if (!BOT_PRIVATE_URL || BOT_PRIVATE_URL.includes('请在这里填入')) {
            showError('系统未配置BOT访问链接，请联系管理员');
            return;
        }

        // 跳转到扣子BOT
        window.location.href = BOT_PRIVATE_URL;
    } else {
        // 登录失败
        showError(CONFIG.errorMessage);

        // 如果配置了清除密码
        if (CONFIG.clearPasswordOnError) {
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }
}

// 监听回车键提交
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // 页面加载时自动聚焦用户名输入框
    document.getElementById('username').focus();
});

// 开发工具：生成密码的MD5哈希值（仅用于开发调试）
// 在浏览器控制台输入 generateMD5('你的密码') 即可生成
window.generateMD5 = function(password) {
    return md5(password);
};
