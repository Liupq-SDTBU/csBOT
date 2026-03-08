/**
 * 登录逻辑处理 - 后端验证模式
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

// 显示加载状态
function showLoading() {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.textContent = '登录中...';
    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.7';
}

// 隐藏加载状态
function hideLoading() {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.textContent = '登录系统';
    loginBtn.disabled = false;
    loginBtn.style.opacity = '1';
}

// 处理登录
async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // 验证输入是否为空
    if (!username || !password) {
        showError('请输入用户名和密码');
        return;
    }

    // 显示加载状态
    showLoading();

    try {
        // 调用后端认证接口
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // 解析响应
        const result = await response.json();

        // 隐藏加载状态
        hideLoading();

        // 检查响应状态
        if (response.ok && result.success) {
            // 登录成功
            console.log('登录成功，用户:', username);
            console.log('跳转地址:', result.redirectUrl);

            // 检查返回的跳转地址
            if (!result.redirectUrl) {
                showError('系统未配置BOT访问链接，请联系管理员');
                return;
            }

            // ========== 调试模式：显示跳转地址 ==========
            showDebugInfo(result.redirectUrl, username);
        } else {
            // 登录失败
            showError(result.message || CONFIG.errorMessage);

            // 如果配置了清除密码
            if (CONFIG.clearPasswordOnError) {
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        }

    } catch (error) {
        // 网络错误或服务器错误
        console.error('Login error:', error);
        hideLoading();
        showError('网络错误，请检查连接或稍后重试');
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

// ========== 调试功能 ==========

// 显示调试信息弹窗
let redirectTimer = null;

function showDebugInfo(url, username) {
    const modal = document.getElementById('debug-modal');
    const overlay = document.getElementById('debug-overlay');
    const debugUrl = document.getElementById('debug-url');
    const debugStatus = document.getElementById('debug-status');

    // 设置URL显示
    debugUrl.textContent = url;

    // 分析URL并给出提示
    let statusHtml = '';
    if (url.includes('www.coze.cn/store/bot/')) {
        statusHtml = '<span style="color: #28a745;">✅ 链接格式正确，是扣子BOT的私有访问链接</span>';
    } else if (url.includes('github.io')) {
        statusHtml = '<span style="color: #dc3545;">❌ 错误：这是 GitHub Pages 的链接，不是扣子BOT链接</span>';
    } else {
        statusHtml = '<span style="color: #ffc107;">⚠️ 链接格式不确定，请检查是否正确</span>';
    }
    debugStatus.innerHTML = statusHtml;

    // 显示弹窗和遮罩
    modal.style.display = 'block';
    overlay.style.display = 'block';

    // 同时输出到控制台
    console.log('========== 调试信息 ==========');
    console.log('登录用户:', username);
    console.log('跳转地址:', url);
    console.log('==============================');

    // 3秒后自动跳转
    redirectTimer = setTimeout(function() {
        continueRedirect(url);
    }, 3000);
}

// 继续跳转
function continueRedirect(url) {
    // 清除定时器
    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }

    // 隐藏弹窗
    document.getElementById('debug-modal').style.display = 'none';
    document.getElementById('debug-overlay').style.display = 'none';

    // 执行跳转
    console.log('正在跳转到:', url);
    window.location.href = url;
}

// 取消跳转
function cancelRedirect() {
    // 清除定时器
    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }

    // 隐藏弹窗
    document.getElementById('debug-modal').style.display = 'none';
    document.getElementById('debug-overlay').style.display = 'none';

    // 显示提示
    showError('已取消跳转，请检查后端配置中的 BOT_URL');

    // 清空密码
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// 在新窗口中打开链接
function openInNewWindow(url) {
    // 清除定时器
    if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
    }

    // 隐藏弹窗
    document.getElementById('debug-modal').style.display = 'none';
    document.getElementById('debug-overlay').style.display = 'none';

    // 在新窗口打开
    console.log('在新窗口打开:', url);
    window.open(url, '_blank');
}
