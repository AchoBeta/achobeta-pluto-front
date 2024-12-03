<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/axios/axios'
import _ from 'lodash'; // 引入 lodash
// 导入点赞前后的 SVG 图标
import hand1 from '@/assets/icons/personal-center-hand1.svg';
import hand2 from '@/assets/icons/personal-center-hand2.svg';

const props = defineProps({
  id: { type: String, default: '' },
  teamId: { type: String, default: '' },
  teamName: { type: String, default: '' },
  level: { type: [String, Number], default: '' },
});
console.log('接收到的参数:', props.id, props.teamId, props.teamName, props.level);

// 定义响应式变量
const userData = ref({}); // 用户个人信息
const likeCount = ref(0); // 点赞数
const isLiked = ref(false); // 点赞状态

// 获取用户数据函数
async function fetchUserData() {
  try {
    const response = await apiClient.get('/api/user-profile/details', {
        params: { member_id: props.id }, // 使用 props.id 作为参数
    });
    console.log('获取用户数据:', response);

    const { code, message, data } = response.data;

    if (response.data.code === 20000) {
      const data = response.data.data;

      // 处理所属团队及职位信息
      if (data.member_position && Array.isArray(data.member_position)) {
        data.member_position = data.member_position.map((team) => {
          const positions = team.position_node
            .map((pos) => pos.position_name)
            .join('，'); // 使用顿号分隔多个职位
          return `${team.team_name}（${positions}）`; // 输出格式：团队名（职位1，职位2）
        }).join('；'); // 使用分号分隔多个团队
      }

      userData.value = data;
      likeCount.value = data.like_count || 0;
      isLiked.value = data.is_liked === 1;
    } else if (code === 10001) {
      ElMessage.error('参数无效，请检查输入');
    } else if (code === 40014) {
      ElMessage.error('用户不存在');
    } else if (code === 40013) {
      ElMessage.error('用户查询失败');
    } else {
      ElMessage.error(`未知错误：${message}`);
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    ElMessage.error('加载用户数据失败，请稍后重试');
  }
};

// 点赞切换逻辑
const handleLike = async () => {
  // 本地立即切换状态
  const originalLiked = isLiked.value;
  const originalLikeCount = likeCount.value;

  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;

  try {
    const response = await apiClient.put('/api/team/membermsg/like', {
        member_id: Number(props.id), // Body 参数
    });

    const { code, message, data } = response.data;

    console.log('点赞请求:', response.data);
    if (code === 20000) {
      likeCount.value = data.like_count || 0; // 更新点赞数为后端返回的值
    } else {
      console.error('点赞请求失败:', message);
      // 如果后端返回非成功状态，恢复原始状态
      isLiked.value = originalLiked;
      likeCount.value = originalLikeCount;

     // 根据返回的具体错误码，提示用户
      handleLikeError(code, message);
    }
  } catch (error) {
    console.error('点赞请求失败:', error);
    // 恢复原始状态
    isLiked.value = originalLiked;
    likeCount.value = originalLikeCount;
    ElMessage.error('网络错误，请稍后重试');
  }
}
// 防抖处理
const toggleLike = _.debounce(handleLike, 1000); // 防抖时间为 1000 毫秒
// 错误处理函数
function handleLikeError(code, message) {
  switch (code) {
    case 10001:
      ElMessage.error('参数无效，请联系管理员');
      break;
    case 60003:
    case 20013:
      ElMessage.error('操作被锁定，请稍后再试');
      break;
    case 40014:
      ElMessage.error('用户不存在，请检查用户信息');
      break;
    case 40013:
      ElMessage.error('用户查询失败，请稍后重试');
      break;
    default:
      ElMessage.error(message || '未知错误，请稍后重试');
  }
}

// 页面加载时获取用户数据
onMounted(() => {
   fetchUserData();
});

// 时间格式化工具函数
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
</script>

<template>
  <div class="personal-center">
    <!-- 外层容器 -->
    <div class="content-wrapper">
      <div class="header">
        <el-icon class="back-icon" @click="$router.push('/team')">
          <ArrowLeftBold />
        </el-icon>
        <div class="title-with-icon">
          <h2>个人信息</h2>
          <!-- 用户图标 -->
          <img src="@/assets/icons/personal-center-pepole.svg" alt="用户图标" class="info-icon" />
        </div>
        <div class="action-section">
          <!-- 点赞按钮 -->
          <button @click="toggleLike" class="like-button">
            <img :src="isLiked ? hand2 : hand1" alt="点赞图标" class="like-icon" />
            <span class="like-count">{{ likeCount }}</span>
          </button>
        </div>
      </div>

      <!-- 使用 el-scrollbar 包裹滚动内容 -->
      <div class="info-box">
          <div class="info-section">
            <!-- 第二行 -->
            <div class="info-row">
              <div>
                <span>真实姓名</span>
                <div>{{ userData.name || '未填写' }}</div>
              </div>
              <div>
                <span>性别</span>
                <div>{{ userData.sex || '未填写' }}</div>
              </div>
              <div></div>
            </div>

            <!-- 第三行 -->
            <div class="info-row">
              <div>
                <span>加入时间</span>
                <div>{{userData.create_date ? formatDate(userData.create_date) : '未填写' }}</div>
              </div>
              <div>
                <span>所属团队/职位</span>
                <div>{{ userData.member_position || '未填写' }}</div>
              </div>
              <div></div>
            </div>

            <!-- 第四行 -->
            <div class="info-row">
              <div>
                <span>身份证号</span>
                <div>{{ userData.id_card  || '未填写' }}</div>
              </div>
              <div>
                <span>手机号</span>
                <div>{{ userData.phone_num  || '未填写' }}</div>
              </div>
              <div>
                <span>邮箱</span>
                <div>{{ userData.email || '未填写' }}</div>
              </div>
            </div>

            <!-- 第五行 -->
            <div class="info-row">
              <div>
                <span>年级</span>
                <div>{{ userData.grade || '未填写' }}</div>
              </div>
              <div>
                <span>专业</span>
                <div>{{ userData.major || '未填写' }}</div>
              </div>
              <div>
                <span>学号</span>
                <div>{{ userData.student_id || '未填写' }}</div>
              </div>
            </div>

            <!-- 第六行 -->
            <div class="info-row">
              <div>
                <span>实习、创业、就职经历</span>
                <div>{{ userData.experience || '未填写' }}</div>
              </div>
            </div>

            <!-- 最后一行 -->
            <div class="info-row">
              <div>
                <span>现状</span>
                <div>{{ userData.status || '未填写' }}</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal-center {
  background-color: #f4f4f4; /* 浅灰色背景 */
}

/* 包裹 header 和 info-box */
.content-wrapper {
  display: flex;
  flex-direction: column; /* 让子元素按列布局 */
  background: linear-gradient(to bottom, #fdf6f0, #d7e3fc); /* 消息框背景颜色 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px; /* 包裹内边距 */
  margin: 0 auto;
  height: 750px; /* 固定高度*/
}

.back-icon {
  font-size: 26px;
  color: #333;
  cursor: pointer;
  margin-top: 2px;
}

.back-icon:hover {
  color: #409eff; /* 悬停时变为主题色 */
}

.info-box {
  flex: 1; /* 占据剩余空间 */
  position: relative; /* 使图标相对于滚动内容区域 */
  margin-top: 20px; /* 为 info-box 添加顶部间距 */
  padding: 10px 120px; /* 左侧增加额外的内边距 */
  max-height: 800px; /* 限制高度 */
}

.el-scrollbar__bar {
  background: #cfd8dc; /* 滚动条的背景色 */
  border-radius: 4px;
}

.custom-scrollbar ::v-deep(.el-scrollbar__bar) {
  background: transparent; /* 滚动条背景透明 */
}

.custom-scrollbar ::v-deep(.el-scrollbar__thumb) {
  height: 5px; /* 固定滑块高度 */
  background: #90a4ae; /* 滑块颜色 */
  border-radius: 4px;  /* 滑块圆角 */
  opacity: 0.8;        /* 滑块透明度 */
}

.custom-scrollbar ::v-deep(.el-scrollbar__thumb:hover) {
  background: #607d8b; /* 鼠标悬停时滑块颜色 */
}

.header {
  display: flex;
  justify-content: flex-start; /* 标题和图标区域靠左对齐 */
  align-items: flex-start; /* 标题和图标靠上对齐 */
  gap: 5px; /* 分隔“返回按钮”和标题部分的距离 */
}

.title-with-icon {
  display: flex;
  gap: 10px; /* 图标与标题的间距 */
}

.title-with-icon h2 {
  font-size: 1.7em; /* 标题字体大小 */
  font-weight: 550; 
  color: #333; /* 标题颜色 */
  margin: 0; /* 去掉标题的默认外边距 */
}

.title-with-icon .info-icon {
  width: 45px; /* 图标宽度 */
  transition: transform 0.3s; /* 鼠标悬停动画 */
}

.title-with-icon .info-icon:hover {
  transform: scale(1.2); /* 鼠标悬停时放大图标 */
  cursor: pointer;
}

.action-section {
  display: flex;
  align-items: center;
  margin-left: auto; /* 推动到右侧 */
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
  gap: 30px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 171px;
  align-items: start;
}

.info-row div {
  text-align: left;
  padding: 2px 0;
}

.info-row span {
  font-weight: 545;
  font-size: 1.1em;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.info-row div div {
  font-size: 0.9em;
  color: #333;
  margin-bottom: 13px;
}
</style>
