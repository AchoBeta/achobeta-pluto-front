<script setup>
import { ref, onMounted } from 'vue';
import { requestCaptcha, updateCountdown, resetGetCodeButton } from './utils/captcha.js';
import router from '@/router';
import { checkAutoLoginApi } from '@/axios/api/login'
import { login } from './utils/login.js';

const phoneInput = ref(null);
const phoneError = ref(null);
const captchaInput = ref(null);
const captchaError = ref(null);
const getCodeButton = ref(null);
const loginRemember = ref(false);

// 在页面加载时启动倒计时检查
onMounted(async() => {
  try{
  const rtoken = localStorage.getItem('rtoken');
  //console.log("自动登录-前端获取的rtoken:",rtoken);
  const response = await checkAutoLoginApi(rtoken);
  console.log("自动登录-后端响应:",response.data)
  if (response.data.code === 20000) {
    // 自动登录成功，跳转到主页
    router.push('/home');
    localStorage.setItem('rtoken', response.data.data.rtoken);
    localStorage.setItem('atoken', response.data.data.atoken);
  } else {
    // 自动登录失败，显示登录弹窗
    console.log('自动登录失败');
  }}
  catch(error){
    // 处理请求错误
    console.error('Failed to check auto login:', error);
  };
  updateCountdown(getCodeButton.value, () => resetGetCodeButton(getCodeButton.value));
});

// 封装函数调用
const handleGetCodeClick = () => requestCaptcha(phoneInput.value, phoneError.value, () => updateCountdown(getCodeButton.value, () => resetGetCodeButton(getCodeButton.value)));
const handleLoginClick = async () => {
  await login(phoneInput.value, captchaInput.value, captchaError.value, loginRemember.value);
};
</script>

<template>
  <div class="container">
    <div class="welcome">
      <h1 class="welcome-title">AchoBeta欢迎您</h1>
      <img src="/achobeta.ico" alt="AchoBeta Logo" class="welcome-image" />
    </div>
    <div class="login-box">
      <div class="input-group">
        <label for="phone">手机号码</label>
        <input ref="phoneInput" type="tel" id="phone" placeholder="请输入手机号码" required />
      </div>
      <div ref="phoneError" id="phone-error" class="error-message"></div>
      <div class="input-group">
        <label for="captcha">验证码</label>
        <input ref="captchaInput" type="text" id="captcha" placeholder="请输入验证码" required />
        <button ref="getCodeButton" class="get-code" @click="handleGetCodeClick">获取验证码</button>
      </div>
      <div ref="captchaError" id="captcha-error" class="error-message"></div>
      <div class="options">
        <label>
          <input v-model="loginRemember" type="checkbox" /> 三十天自动登录
        </label>
      </div>
      <button class="login-btn" @click="handleLoginClick">登录/注册</button>
      <p class="note">未注册手机号登录后将自动注册</p>
    </div>
  </div>
</template>


<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    display: flex;
    height: 100vh; /* 设置为全屏高度 */
}

.container {
    display: flex;
    width: 100vw;
    height: 100vh;
}

.welcome {
    flex: 0 0 35%; /* 左侧欢迎部分占据35%的宽度 */
    background-color: #9dcaf2d2;
    padding: 40px;
    display: flex;
    flex-direction: column; /* 垂直排列图片和标题 */
    justify-content: center; /* 让内容在竖直方向上居中 */
    align-items: center; /* 水平方向居中 */
}

.welcome-title {
    text-align: center; /* 使文本水平居中 */
    margin-top: 100px; 
    font-size: 36px; /* 增加字体大小 */
    font-weight: bold; /* 设置为粗体 */
    color: #007bff; /* 使用蓝色，使标题更加鲜明 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* 添加文本阴影以增加立体感 */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 更改为更现代、优雅的字体 */
    letter-spacing: 2px; /* 增加字母间距 */
}

.welcome-image {
    width: 300px; /* 调整图片宽度 */
    height: 300px; /* 调整图片高度 */
    border-radius: 50%; /* 使图片变成圆形 */
    object-fit: cover; /* 保持图片的正确比例并填充 */
    margin-bottom: 20px; /* 图片和标题之间的间距 */
}

.login-box {
    flex: 1; /* 占据剩余宽度 */
    max-width: 500px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.373);
}

.error-message {
    color: red;
    font-size: 11px;
    margin-bottom: 15px;
    display: none; /* 默认隐藏 */
}

.input-group {
    margin-bottom: 15px;
    display: flex; /* 使用flex布局 */
    align-items: center; /* 垂直居中对齐 */
    gap: 12px; /* 控制输入框与按钮的间距 */
    width: 100%; /* 确保 input-group 在容器内 */
}

label {
    flex: 0 0 80px; /* 固定标签宽度 */
    margin-right: 10px; /* 标签与输入框之间的间距 */
}

input[type="tel"], input[type="text"] {
    flex: 1; /* 输入框占据剩余空间 */
    padding: 10px;
    border: 1px solid #ccc; /* 添加边框 */
    border-radius: 6px; /* 圆角边框 */
    outline: none; /* 去掉聚焦时的轮廓 */
    font-size: 18px; /* 增加字体大小 */
    height: 50px; /* 增加高度 */
    box-sizing: border-box; /* 防止内边距影响尺寸 */
    min-width: 0; /* 避免 flex 布局导致的输入框溢出 */
}

.get-code {
    padding: 10px 14px; /* 调整内边距 */
    background-color: transparent; /* 按钮背景透明 */
    color: #4682b4; /* 按钮文字颜色为浅蓝色 */
    border: none; /* 移除边框 */
    border-radius: 4px; /* 圆角 */
    cursor: pointer; /* 鼠标悬停效果 */
    font-size: 14px;
    white-space: nowrap; /* 防止文字换行 */
    flex-shrink: 0; /* 防止按钮缩小 */
}


.options {
    margin-top: auto; /* 使勾选框推到底部 */
    text-align: right; /* 右对齐 */
    font-size: 12px;
} 

.login-btn {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    width: 100%; /* 设置按钮宽度为100% */
    max-width: 300px; /* 可选：设置按钮的最大宽度 */
    margin: 10px auto 0; /* 使用 margin: 0 auto; 使按钮水平居中，增加上边距 */
}

.note {
    font-size: 12px;
    color: gray;
    text-align: center;
}
</style>

