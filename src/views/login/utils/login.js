import axios from 'axios';


function parseJwt(token) {
  // 解析 JWT 中的 payload 部分
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export function login(phoneInput, captchaInput, captchaError, loginRemember) {
  const phoneNumber = phoneInput.value;
  const captcha = captchaInput.value;
  const remember = loginRemember;
  const captchaPattern = /^[A-Za-z0-9]{6}$/;

  if (!captchaPattern.test(captcha)) {
    captchaError.style.display = 'block';
    captchaError.textContent = '验证码格式不正确，请重试';
    return;
  } else {
    captchaError.style.display = 'none';
  }

  axios.post('/api/login/login', {
      phone: String(phoneNumber),  // 将手机号转为字符串
      code: String(captcha),       // 将验证码转为字符串
      auto_login: true,            // 添加 auto_login 参数并设置为 true
      remember: remember,            // 三十天免登录
    })
    .then(response => {
      const data = response.data;
      console.log('后端响应内容:', data); // 打印后端响应内容

      if (data.code === 200 && data.Message === '成功') { 
        // 成功处理逻辑
        alert('登录成功');
        const responseData = data.Data;

         // 存储必要的登录信息
         localStorage.setItem('atoken', responseData.atoken);    // 令牌
         if (remember && responseData.rtoken) localStorage.setItem('rtoken', responseData.rtoken); // 当用户勾选了且rtokrn存在时，刷新令牌
         localStorage.setItem('service_id', responseData['service id']); // 业务id
         localStorage.setItem('user_agent', responseData.user_agent); // 用户代理信息
         localStorage.setItem('ip', responseData.ip); // IP地址

         // 解析 atoken 以获取 userid
        const payload = parseJwt(responseData.atoken);
        if (payload && payload.userid) {
          localStorage.setItem('userid', payload.userid); // 存储用户 ID
        } else {
          console.warn('无法从 atoken 中提取 userid');
        }
      } else {
        captchaError.style.display = 'block';
        captchaError.textContent = data.Message || '验证码错误，请重试';
      }
    })
    .catch(error => {
      console.error('请求出错：', error);
      captchaError.style.display = 'block';
      captchaError.textContent = '请求登录失败，请稍后重试';
    });
}
