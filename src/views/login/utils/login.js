import axios from 'axios';
import router from '@/router'; // 根据实际路径调整

export async function login(phoneInput, captchaInput, captchaError, loginRemember) {
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

  try {
    const response = await axios.post('/api/login/login', {
      phone: String(phoneNumber),
      code: String(captcha),
      auto_login: remember
    });

    const data = response.data;
    console.log('登录按钮:', data);
    if (data.code === 20000) {
      const responseData = data.data;

      if (responseData.is_team) {
        // 存储登录信息
        localStorage.setItem('atoken', responseData.atoken);
        if (remember && responseData.rtoken) localStorage.setItem('rtoken', responseData.rtoken);
        localStorage.setItem('service_id', responseData.id);
        localStorage.setItem('user_agent', responseData.user_agent);
        localStorage.setItem('ip', responseData.ip);
        reflash = false;
        // 登录成功后跳转到主页
        router.push('/home');
      } else {
        captchaError.style.display = 'block';
        captchaError.textContent = '非团队成员，无法进入系统';
      }
    } else {
      captchaError.style.display = 'block';
      captchaError.textContent = data.message || '验证码错误，请重试';
    }
  } catch (error) {
    console.error('请求出错：', error);
    captchaError.style.display = 'block';
    captchaError.textContent = '请求登录失败，请稍后重试';
  }
}
