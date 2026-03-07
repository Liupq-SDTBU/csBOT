/**
 * 配置文件 - 请根据实际情况修改
 */

// 扣子BOT的私有访问链接
// 从扣子平台获取，格式如：https://www.coze.cn/store/bot/xxx?bid=xxx
const BOT_PRIVATE_URL = '请在这里填入你的扣子BOT私有访问链接';

// 用户凭证配置（用户名: MD5哈希后的密码）
// 使用工具生成MD5: https://www.md5hashgenerator.com/
// 或者部署后在控制台输入: generateMD5('你的密码')
const USER_CREDENTIALS = {
    'admin': '21232f297a57a5a743894a0e4a801fc3',      // 密码: admin
    'teacher': '5f4dcc3b5aa765d61d8327deb882cf99',    // 密码: password
    'student': 'e10adc3949ba59abbe56e057f20f883e'     // 密码: 123456
};

// 系统配置
const CONFIG = {
    // 登录失败时的错误提示
    errorMessage: '用户名或密码错误，请重试',

    // 错误提示显示时长（毫秒）
    errorDisplayDuration: 3000,

    // 错误提示消失后是否清除密码
    clearPasswordOnError: true
};
