<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 导入点赞前后的 SVG 图标
import hand1 from '@/assets/icons/personal-center-hand1.svg';
import hand2 from '@/assets/icons/personal-center-hand2.svg';

// 定义响应式变量
const userData = ref({}); // 用户个人信息
const likeCount = ref(0); // 点赞数
const isLiked = ref(false); // 点赞状态

// 保存初始状态的变量
const initialIsLiked = ref(false);
const initialLikeCount = ref(0);

// 获取用户数据函数
async function fetchUserData() {
  try {
    const response = await axios.get('/api/GetMemberDetail', {
      params: {
        userid: localStorage.getItem('userid'),
      },
    });
    if (response.data.code === 200) {
      const data = response.data.data;
      userData.value = data; // 保存用户数据
      likeCount.value = data.likecount || 0; // 初始化点赞数
      isLiked.value = data.isLiked || false; // 初始化点赞状态

      // 保存初始状态
      initialIsLiked.value = isLiked.value;
      initialLikeCount.value = likeCount.value;
    } else {
      console.error('获取个人中心用户数据失败');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// 点赞切换逻辑
async function toggleLike() {
  // 本地立即切换状态
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;

  try {
    const response = await axios.put('/api/PutLikeCount', {
      atoken: localStorage.getItem('atoken'),
      userid: localStorage.getItem('userid'),
    });

    if (response.data.code === 200) {
      // 使用后端返回的最新点赞数
      likeCount.value = response.data.likecount;
    } else {
      console.error('点赞请求失败');
      rollbackToInitialState();
    }
  } catch (error) {
    console.error('点赞请求出错:', error);
    rollbackToInitialState();
  }
}

// 回滚到初始状态函数
function rollbackToInitialState() {
  isLiked.value = initialIsLiked.value;
  likeCount.value = initialLikeCount.value;
}

// 页面加载时获取用户数据
onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="personal-center">
    <div class="info-box">
      <div class="header">
        <h2>&lt; 个人信息</h2>
        <div class="info-icon">
          <!-- 添加右边的图片 -->
          <img src="@/assets/icons/personal-center-pepole.svg" alt="用户图标" />
        </div>
        <div class="like-section">
          <!-- 点赞按钮 -->
          <button @click="toggleLike" class="like-button">
            <!-- 动态切换 SVG 图标 -->
            <img
              :src="isLiked ? hand2 : hand1"
              alt="点赞图标"
              class="like-icon"
            />
            <span class="like-count">{{ likeCount }}</span>
          </button>
        </div>
      </div>

      <!-- 信息展示 -->
      <div class="info-section">
        <!-- 第二行 -->
        <div class="info-row">
          <div>
            <span>真实姓名</span>
            <div>{{ userData.name || '未知' }}</div>
          </div>
          <div>
            <span>性别</span>
            <div>{{ userData.sex || '未知' }}</div>
          </div>
          <div></div>
        </div>

        <!-- 第三行 -->
        <div class="info-row">
          <div>
            <span>加入时间</span>
            <div>{{ userData.create_date || '未知' }}</div>
          </div>
          <div>
            <span>所属团队/职位</span>
            <div>{{ userData.strucet_name || '未知' }}</div>
          </div>
          <div></div>
        </div>

        <!-- 第四行 -->
        <div class="info-row">
          <div>
            <span>身份证号</span>
            <div>{{ userData.idcard || '未知' }}</div>
          </div>
          <div>
            <span>手机号</span>
            <div>{{ userData.phone_num || '未知' }}</div>
          </div>
          <div>
            <span>邮箱</span>
            <div>{{ userData.email || '未知' }}</div>
          </div>
        </div>

        <!-- 第五行 -->
        <div class="info-row">
          <div>
            <span>年级</span>
            <div>{{ userData.grade || '未知' }}</div>
          </div>
          <div>
            <span>专业</span>
            <div>{{ userData.major || '未知' }}</div>
          </div>
          <div>
            <span>学号</span>
            <div>{{ userData.student_id || '未知' }}</div>
          </div>
        </div>

        <!-- 第六行 -->
        <div class="info-row">
          <div>
            <span>实习、创业、就职经历</span>
            <div>{{ userData.experience || '未知' }}</div>
          </div>
          <div></div>
          <div></div>
        </div>

        <!-- 最后一行 -->
        <div class="info-row">
          <div>
            <span>现状</span>
            <div>{{ userData.status || '未知' }}</div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

      <!-- 右下角图标 -->
      <div class="message-icon">
        <img src="@/assets/icons/personal-center-message.svg" alt="消息图标" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.personal-center {
  padding: 16px;
  background-color: #f4f4f4; /* 浅灰色背景 */
  min-height: 100vh; /* 确保背景色覆盖整个视口 */
}

.info-box {
  position: relative; /* 设置相对定位，方便内部绝对定位的图标参照 */
  height:730px;
  margin: 0 auto;
  padding: 10px;
  border-radius: 8px;
  background: linear-gradient(to bottom, #fdf6f0, #e3e8f1);/* 消息框背景颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: auto; /* 内容溢出时显示滚动条 */
}

.message-icon {
  position: absolute; /* 绝对定位 */
  bottom: 10px; /* 距离底部 10px */
  right: 10px; /* 距离右侧 10px */
}

.message-icon img {
  width: 200px; /* 控制图标宽度 */
  height: 200px; /* 控制图标高度 */
  opacity: 0.8; /* 轻微透明效果 */
  transition: opacity 0.5s; /* 添加鼠标悬停效果 */
}

.message-icon img:hover {
  opacity: 1; /* 悬停时变为不透明 */
}

.header {
  padding: 0 30px;
  display: flex;
  justify-content: flex-start; /* 元素从左到右排列 */
  justify-content: space-between;
  align-items: center;
  gap: 10px; /* 控制图标与标题之间的距离 */
}

.info-icon img {
  width: 40px; /* 控制用户图标的宽度 */
  height: 40px; /* 控制用户图标的高度 */
}

.like-section {
  margin-left: auto; /* 将点赞区域推到右侧 */
  display: flex;
  align-items: center;
}

.like-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
}

.like-icon {
  width: 40px; /* 图标宽度 */
  height: 40px; /* 图标高度 */
}

.like-count {
  margin-top: 4px;
  font-size: 1em;
  color: #333;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 5px 0;
}

.info-row div {
  text-align: center;
  padding: 10px 0;
}

.info-row span {
  font-weight: bold;
  font-size: 1em;
  color: #666;
  display: block; /* 确保属性值换行展示 */
}

.info-row div div {
  font-size: 0.9em;
  color: #333;
}
</style>
