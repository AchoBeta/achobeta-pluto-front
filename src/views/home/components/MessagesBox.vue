<template>
  <div class="box messages-box">
    <div class="messages-header">
      <h3 class="box-title">消息</h3>
      <!-- Element Plus 的 el-button -->
      <el-button type="primary" text class="read-all-button" @click="markAllAsRead">全部已读</el-button>
    </div>
    <ul class="message-list">
      <li v-for="message in messages" :key="message.id" class="message-item">
        <div class="dot-and-content" @click="openModal(message)">
          <span v-if="!message.read" class="unread-dot"></span>
          <span :class="['message-content', { read: message.read }]">
            {{ message.content.length > 22 ? message.content.slice(0, 25) + '...' : message.content }}
          </span>
        </div>
        <div class="message-right">
          <span
            :class="['message-type', { system: message.type === '系统通知', team: message.type === '团队通知' }]"
          >
            {{ message.type }}
          </span>
        </div>
      </li>
    </ul>
    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="allMessages.length"
        :page-size="5"
        v-model:current-page="currentPage"
        @current-change="updateMessages"
      />
    </div>

    <!-- 弹框 -->
    <el-dialog
      v-model="showModal"
      title="消息"
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
import { ref, onMounted } from 'vue';

const totalPages = ref(5);
const currentPage = ref(1);
const allMessages = ref([]);
const messages = ref([]);
const showModal = ref(false);
const modalContent = ref('');

function loadMessages() {
  const savedReadStatus = JSON.parse(localStorage.getItem('readStatus')) || {};
  const mockData = [];
  for (let i = 1; i <= 50; i++) {
    const isRead = !!savedReadStatus[i];
    mockData.push({
      id: i,
      content: `这是第${i}条消息内容。这是完整消息内容，用于展示弹窗效果。`,
      type: i % 2 === 0 ? '系统通知' : '团队通知',
      read: isRead,
    });
  }
  allMessages.value = mockData;
  updateMessages();
}

function saveReadStatus() {
  const readStatus = {};
  allMessages.value.forEach((message) => {
    readStatus[message.id] = message.read;
  });
  localStorage.setItem('readStatus', JSON.stringify(readStatus));
}

function updateMessages() {
  const start = (currentPage.value - 1) * 5;
  messages.value = allMessages.value.slice(start, start + 5);
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updateMessages();
  }
}

function markAllAsRead() {
  allMessages.value.forEach((message) => (message.read = true));
  saveReadStatus();
  updateMessages();
}

function openModal(message) {
  message.read = true;
  saveReadStatus();
  updateMessages();
  modalContent.value = message.content;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

onMounted(() => {
  loadMessages();
});
</script>

<style scoped>
/* 消息框样式 */
.box {
  background-color: #ffffff; /* 消息框背景颜色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  padding: 20px; /* 内边距 */
  flex: 1;
  height: 360px; /* 高度固定 */
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
  margin-top: 10px;
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


