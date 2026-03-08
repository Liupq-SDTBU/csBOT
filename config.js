/**
 * 配置文件 - 后端验证模式
 * 说明：敏感信息（用户凭证、BOT链接）已移至后端，前端不再存储
 */

// API 接口地址
const API_ENDPOINT = '/api/auth';

// 错误消息配置
const CONFIG = {
    errorMessage: '用户名或密码错误，请重试',
    errorDisplayDuration: 3000,
    clearPasswordOnError: true
};
