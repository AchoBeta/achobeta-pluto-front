import axios from 'axios';

/**
 * 请求验证码函数
 * @param {HTMLInputElement} phoneInput - 手机号输入框元素
 * @param {HTMLElement} phoneError - 错误提示元素
 * @param {Function} updateCountdown - 更新倒计时的回调函数
 */
export function requestCaptcha(phoneInput, phoneError, updateCountdown) {
  // 修改：确保手机号为字符串格式
  const phoneNumber = phoneInput.value.toString();

  // 使用 POST 请求，将手机号放入请求体中
  axios.post('/api/login/code', { phone: phoneNumber })
    .then(response => {
      console.log("后端返回的数据:", response.data); // 打印后端的完整响应数据

      const data = response.data;

      // 根据后端返回的数据结构调整判断条件
      if (data.Code === 200 && data.Data.Code === 20000) {
        // 如果请求成功，隐藏错误提示，并开始倒计时
        phoneError.style.display = 'none';
        const expirationTime = Date.now() + 60 * 1000;
        localStorage.setItem('captchaExpirationTime', expirationTime);
        updateCountdown();
      } else {
        // 如果请求不成功，显示错误提示
        phoneError.style.display = 'block';
        phoneError.textContent = data.Message || '手机号不合法，请重新输入';
      }
    })
    .catch(error => {
      // 请求出错时的处理
      console.error('请求出错：', error);
      phoneError.style.display = 'block';
      phoneError.textContent = '请求验证码失败，请稍后重试';
    });
}

/**
 * 更新倒计时函数
 * @param {HTMLButtonElement} getCodeButton - 获取验证码按钮
 * @param {Function} resetGetCodeButton - 重置获取验证码按钮的回调函数
 */
export function updateCountdown(getCodeButton, resetGetCodeButton) {
  const expirationTime = localStorage.getItem('captchaExpirationTime');
  if (expirationTime) {
    const timeRemaining = Math.floor((expirationTime - Date.now()) / 1000);
    if (timeRemaining > 0) {
      // 更新按钮文本并禁用按钮
      getCodeButton.disabled = true;
      getCodeButton.textContent = `重新获取 (${timeRemaining}s)`;
      // 每秒更新倒计时
      setTimeout(() => updateCountdown(getCodeButton, resetGetCodeButton), 1000);
    } else {
      // 倒计时结束，重置按钮
      resetGetCodeButton();
    }
  }
}

/**
 * 重置获取验证码按钮的函数
 * @param {HTMLButtonElement} getCodeButton - 获取验证码按钮
 */
export function resetGetCodeButton(getCodeButton) {
  getCodeButton.disabled = false;
  getCodeButton.textContent = '重新获取';
  localStorage.removeItem('captchaExpirationTime');
}
