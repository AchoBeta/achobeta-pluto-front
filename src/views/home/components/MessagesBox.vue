<template>
  <div class="box messages-box">
    <div class="messages-header">
      <h3 class="box-title">消息</h3>
      <el-button type="primary" text class="read-all-button" @click="markAllAsRead">全部已读</el-button>
    </div>

    <!-- 消息列表 -->
    <ul class="message-list">
      <template v-if="Array.isArray(messages) && messages.length > 0">
      <li
        v-for="message in messages"
        :key="message.user_message_id"
        class="message-item"
      >
        <div class="dot-and-content" @click="handleMessageClick(message)">
          <span v-if="!message.is_read" class="unread-dot"></span>
          <span :class="['message-content', { read: message.is_read }]">
            {{ message.content.length > 25
              ? message.content.slice(0, 25) + '...'
              : message.content }}
          </span>
        </div>
        <div class="message-right">
          <span
            :class="['message-type', { system: message.type === 0, team: message.type === 1 }]"
          >
            {{ message.type === 0 ? '系统通知' : '团队通知' }}
          </span>
        </div>
      </li>
    </template>
    <template v-else>
        <!-- 无消息时显示图标和提示 -->
        <div class="no-data-container">
          <img :src="NoDataIcon" alt="暂无消息" class="no-data-icon" />
          <p class="no-data-text">暂无消息</p>
        </div>
      </template>
    </ul>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalPages * messagesPerPage"
        :page-size="messagesPerPage"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 弹框 -->
    <el-dialog
      v-model="showModal"
      title="消息详情"
      width="500px"
      align-center
      class="custom-dialog"
    >
      <p class="modal-text">{{ modalContent }}</p>
      <template #footer>
        <el-button @click="closeModal" class="custom-close-button">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getMessages, markMessageAsRead, markMessagesAsRead } from '../utils/message.js';
import NoDataIcon from '@/assets/icons/no-data.svg';

const messages = ref([]); // 当前页的消息列表
const currentPage = ref(1); // 当前页码
const totalPages = ref(1); // 总页数
const messagesPerPage = 5; // 每页消息数（前端分页控件）
const showModal = ref(false); // 控制弹框显示状态
const modalContent = ref(''); // 弹框中的消息内容
const timestamp = ref(0); // 用于增量更新的时间戳
let intervalId = null; // 定时器 ID，用于定时检查更新
const atoken = localStorage.getItem('atoken') || '';// 从 localStorage 获取用户令牌

//获取当前页消息
const fetchMessages = async (page = 1,timestamp = 0) => {
  try {
    const atoken = localStorage.getItem('atoken'); // 从 localStorage 获取 atoken
    console.log('Fetched atoken:', atoken);

    if (!atoken) {
      ElMessage.error('未检测到登录信息，请重新登录');
      return;
    }

    const data = await getMessages(atoken, page, timestamp);// 调用 getMessages 接口
    console.log('后端返回的数据:', data);

    if (data && data.code === 20000) {
      // 验证后端返回的 messages 是否是数组
      const fetchedMessages = Array.isArray(data.data?.messages)
        ? data.data.messages
        : []; // 如果不是数组，设置为空
        console.log('fetchedMessages:', fetchedMessages);

        if (!Array.isArray(fetchedMessages)) {
        console.error('后端返回的 messages 不是数组:', fetchedMessages);
        throw new Error('后端返回的 messages 数据格式错误');
      }

      // 确保 `is_read` 转换为布尔值
      messages.value = fetchedMessages
        .filter(msg => typeof msg === 'object' && msg.user_message_id && msg.content) // 过滤无效数据
        .map(msg => ({
          ...msg,
          is_read: msg.is_read === 1, // 确保 `is_read` 为布尔值
  }));

  // 日志输出验证
console.log('messages.value after processing:', messages.value);

      // 更新分页信息
      totalPages.value = Number(data.data?.total_pages) || 1;
      currentPage.value = page;
      timestamp.value = Math.max(...(messages.value.map((msg) => msg.received_at) || []), 0);
    } else {
      // 处理其他错误
      console.error('后端返回的 code 非 20000:', data);
      handleApiError(data || {});
    }

  } catch (error) {
  }
};
// 错误处理函数
const handleApiError = (data = {}) => {
  const { code, message } = data;

  // 对未定义或格式错误的数据提供默认处理
  if (!code) {
    console.error('收到无效数据:', data);
    ElMessage.error('发生未知错误');
    return;
  }

  // 根据错误码处理不同情况
  switch (code) {
    case 60004:
      ElMessage.error('后台出现错误，请稍后重试');
      break;
    case -20000:
    case -20002:
      ElMessage.error('登录信息已过期，请重新登录');
      break;
    case -20003:
      ElMessage.error('程序出错，请联系开发人员');
      break;
    default:
    console.error('未知错误:', message || '请求失败');
      ElMessage.error(message || '请求失败，请稍后重试');
  }
};

//翻页时重新获取数据
const handlePageChange = async (page) => {
  try {
    console.log('切换到页面:', page);
    currentPage.value = page; // 更新当前页码
    await fetchMessages(page); // 获取对应页码的数据
  } catch (error) {
    console.error('页面切换错误:', error);
  }
};

//标记多条消息为已读
const markAllAsRead = async () => {
  const unreadMessages = messages.value.filter((msg) => !msg.is_read);

  if (messages.value.length === 0) {
    ElMessage.info('暂无消息');
    return;
  }

  if (unreadMessages.length === 0) {
    ElMessage.info('所有消息已是已读状态');
    return;
  }

  // 保存原始状态
  const previousStates = unreadMessages.map((msg) => ({
    message: msg,
    is_read: msg.is_read,
  }));

  // 乐观更新：将所有消息标记为已读
  unreadMessages.forEach((msg) => (msg.is_read = true));

  try {
    const data = await markMessagesAsRead();
    if (data.code !== 20000) throw new Error('后端返回错误');
    ElMessage.success('所有未读消息已成功标记为已读');
  } catch (error) {
    console.error('全部已读请求失败:', error);
    // 请求失败时恢复原始状态
    previousStates.forEach((msg) => {
      const original = messages.value.find((m) => m.user_message_id === msg.message.user_message_id);
      if (original) Object.assign(original, msg); // 恢复原始状态
    });

    if (error.type === 'timeout') {
      ElMessage.error('请求超时，请稍后重试');
    } else {
      ElMessage.error('标记消息失败，请稍后重试');
    }
  }
};

//标记单条消息为已读
const handleMessageClick = async (message) => {
  try {
    modalContent.value = message.content;// 展示消息内容
    showModal.value = true;// 打开消息详情弹框

    if (!message.is_read) {
      const previousState = message.is_read; // 保存原始状态
      message.is_read = true; // 乐观更新：立即标记为已读

      try {
        await markMessageAsRead(message.user_message_id); // 调用后端接口
        message.is_read = true; // 本地更新状态
      } catch (error) {
        console.error('标记消息为已读失败:', error.message || '未知错误');
        message.is_read = previousState; // 恢复原始状态
        ElMessage.error(error.message || '标记消息为已读失败');
      }
    }
  } catch (error) {
    console.error('展示消息失败:', error);
    ElMessage.error(error.message || '操作失败，请稍后重试');
  }
};

const closeModal = () => {
  showModal.value = false;
};

//定时检查更新
const checkForUpdates = async () => {
  try {
    const data = await getMessages(atoken, 1, timestamp.value);
    if (data.code === 200 && data.data.is_updated) {
      await fetchMessages(1);
    }
  } catch (error) {
    console.error('更新检查失败:', error);
  }
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (intervalId) clearInterval(intervalId);
  } else {
    intervalId = setInterval(checkForUpdates, 60000);
  }
};

onMounted(() => {
  fetchMessages();
  intervalId = setInterval(checkForUpdates, 60000);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
/* 消息框样式 */
.box {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between; /* 分页组件始终在底部 */
  background-color: #ffffff;
  height: 360px; /* 高度固定 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.box-title {
  font-size: 1.7em; /* 标题字体大小 */
  font-weight: 530;
  margin: 0;
  line-height: 1;
  padding-bottom: 10px;
}

.read-all-button {
  font-size: 1.2em; /* 调整字体大小 */
  padding: 5px 10px; /* 内边距调整 */
}


.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.message-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  max-height: 250px;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
}

.dot-and-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: red; /* 未读标记为红点 */
  border-radius: 50%;
  display: inline-block; /* 默认占用空间 */
}

.message-item .unread-dot {
  display: inline-block;
}

.message-item:empty .unread-dot {
  display: none; /* 没有内容时隐藏红点 */
}

.message-content {
  color: black;
}

.message-content.read {
  color: gray; /* 已读消息为灰色 */
}

.message-type {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 0.8em;
}

.message-type.system {
  background-color: #67C23A; /* Success 按钮的默认背景颜色 */
  color: white; /* 白色文字 */
  border-radius: 12px; /* 圆角 */
  padding: 5px 10px; /* 内边距 */
  font-size: 1em; /* 字体大小 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡效果 */
}

.message-type.system:hover {
  background-color: #85ce61; /* 悬停时的颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时增加阴影 */
}

.message-type.team {
  background-color: #409EFF; /* Primary 按钮的默认背景颜色 */
  color: white; /* 白色文字 */
  border-radius: 12px; /* Primary 按钮的圆角 */
  padding: 5px 10px; /* 内边距 */
  font-size: 1em; /* 字体大小 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡效果 */
}

.message-type.team:hover {
  background-color: #66b1ff; /* 悬停时的颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时增加阴影 */
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center; /* 确保垂直居中 */
  margin-top: 10px;
}

no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.no-data-icon {
  width: 200px;
  height: 200px;
  margin: 0 auto; /* 保证图标左右居中 */
  display: block; /* 确保为块级元素 */
}

.no-data-text {
  text-align: center;
  color: gray;
  font-size: 1.2em;
  font-weight: 500; 
  margin-top: 20px;
}

/* 自定义弹框样式 */
::v-deep(.custom-dialog) {
  border-radius: 15px; /* 弹框圆角 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* 弹框阴影 */
  background-color: #ffffff; /* 去掉背景颜色，使用纯白 */
  overflow: hidden;
  animation: fadeIn 0.5s ease; /* 弹框淡入动画 */
}

/* 弹框标题样式 */
::v-deep(.custom-dialog .el-dialog__header) {
  color: #333; /* 标题文字颜色 */
  padding: 10px 20px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px dashed #cccccc; /* 分隔线，使用虚线效果 */
}

/* 弹框关闭按钮样式 */
::v-deep(.custom-dialog .el-dialog__close) {
  font-size: 20px;
  color: #555; /* 关闭按钮颜色 */
  transition: color 0.3s ease;
}

::v-deep(.custom-dialog .el-dialog__close:hover) {
  color: #f56c6c; /* 悬停关闭按钮颜色 */
}

/* 弹框内容样式 */
::v-deep(.custom-dialog .modal-text) {
  color: #333; /* 弹框内容颜色 */
  font-size: 1.2em; /* 弹框内容字体大小 */
  line-height: 1.6; /* 弹框内容行高 */
  padding: 15px 20px; /* 内容内边距 */
  text-align: left; /* 左对齐 */
  background-color: #f9f9f9; /* 内容背景颜色 */
  border-radius: 10px; /* 内容区域圆角 */
  margin: 10px; /* 内容外边距 */
}

/* 按钮样式 */
::v-deep(.custom-close-button) {
  background-color: #007bff; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

::v-deep(.custom-close-button:hover) {
  background-color: #0056b3; /* 悬停按钮背景颜色 */
}

/* 淡入动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


