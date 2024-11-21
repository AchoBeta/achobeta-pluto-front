<script setup>
import { getProgressApi } from '@/utils/api/home'

const total_task_count = ref('0');
const incomplete_task_count = ref('0');
const upcoming_overdue_task_count = ref('0');
const overdue_task_count = ref('0');
const activeName = 'first'

onMounted(async () => {
    const atoken = localStorage.getItem('atoken');
    getProgressApi(atoken)
    .then(data => {
      total_task_count.value = data.total_task_count;
      incomplete_task_count.value = data.incomplete_task_count;
      upcoming_overdue_task_count.value = data.upcoming_overdue_task_count;
      overdue_task_count.value = data.overdue_task_count;
  })
  .catch(error => {
    ElMessage.error('项目进度获取失败。')
    console.error('Error fetching progress:', error);
  });
  });
</script>

<template>
  <slot name="Progress">
    <div class="progress-box">
      <div style="display: flex; align-items: center;">
      <el-icon class="calendar" size="24px"><Calendar /></el-icon>
      <h3 class="box-title" style="margin-left: 8px; cursor: default">项目进度</h3>
    </div>
      <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="卡片" name="first">
        <div class="card-container" style="cursor:default">
        <el-card class="progress-card total" shadow="hover">
          <template #header>
            <div class="item-title">
              <el-icon><List /></el-icon>
              <span >总任务数</span>
            </div>
          </template>
          <div class="item-content">{{ total_task_count }}</div>
        </el-card>
 
        <el-card class="progress-card unfinish" shadow="hover">
          <template #header>
            <div class="item-title">
              <el-icon><PieChart /></el-icon>
              <span>我的未完成任务</span>
            </div>
          </template>
          <div class="item-content">{{ incomplete_task_count }}</div>
        </el-card>
 
        <el-card class="progress-card ddl" shadow="hover">
          <template #header>
            <div class="item-title">
              <el-icon><Warning /></el-icon>
              <span>即将逾期</span>
            </div>
          </template>
          <div class="item-content">{{ upcoming_overdue_task_count }}</div>
        </el-card>
 
        <el-card class="progress-card fault" shadow="hover">
          <template #header>
            <div class="item-title">
              <el-icon><CircleClose /></el-icon>
              <span>已逾期</span>
            </div>
          </template>
          <div class="item-content">{{ overdue_task_count }}</div>
        </el-card>
      </div>
      </el-tab-pane>
      <el-tab-pane label="环形进度条" name="second" class="demo-progress" style="cursor: default">
        <div class="progress-item">
          <el-progress type="circle" :percentage="100" status="success"/>
          <div class="progress-label">已完成</div>
        </div>
        <div class="progress-item">
            <el-progress type="circle" :percentage="70" status="warning"/>
            <div class="progress-label">即将逾期</div>
        </div>
        <div class="progress-item">
            <el-progress type="circle" :percentage="50" status="exception"/>
            <div class="progress-label">已逾期</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Role" name="third">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
    </div>
  </slot>
</template>

<style scoped>

.progress-box {
  width: 100%; /* 改为百分比宽度，以便自适应 */
  max-width: 1200px; /* 设置最大宽度 */
  height: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
 
.box-title, .calendar {
  font-size: 1.7em;
  font-weight: 530;
  margin-bottom: 20px;
  margin-top: 0;
  margin-left: 20px;
}

.calendar {
  color:blue;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.card-container {
  display: flex;
  flex-wrap: wrap; /* 允许子元素换行 */
  gap: 30px;
  width: 100%;
  height: 100%;
}
 
.progress-card {
  flex: 1 1 230px; /* 设置卡片的灵活宽度，最小宽度为230px */
  height: 70%;
  padding: 5px;
  background-color: rgba(220, 234, 247, 0.05);
  border-top: solid 1px #333;
  border-radius: 0px 0px 20px 0px;
}
 
.progress-card:hover {
  background-color: rgba(220, 234, 247, 0.15);
  border-radius: 5px 10px 30px 5px;
  box-shadow: rgba(126, 133, 152, 0.514);
}

.progress-card.total * {
  color: #3498db;
}

.progress-card.total:hover {
  border: solid 1.5px #2980b9;
  }

  .progress-card.unfinish * {
  color: #9b59b6;
}

.progress-card.unfinish:hover {
  border: solid 1.5px #8e44ad;
  }

  .progress-card.ddl * {
  color: #e67e22;
}

.progress-card.ddl:hover {
  border: solid 1.5px #d35400;
  }

  .progress-card.fault * {
  color: #c0392b;
}

.progress-card.fault:hover {
  border: solid 1.5px #9e3e34;
  }


.item-content,
.item-title {
  margin-top: 10px;
  font-size: 1.5em;
  color: #333;
  line-height: 1;
  font-weight: 100;
  text-align: center;
}
 
.item-title {
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center; 
}

.demo-progress {
  display: flex;
  justify-content: space-around; /* 根据需要调整进度条之间的间距 */
}
 
.progress-item {
  text-align: center; /* 使文本居中 */
  margin: 10px; /* 根据需要调整每个进度条的外边距 */
}
 
.progress-label {
  margin-top: 10px; /* 调整标签与进度条之间的垂直间距 */
  font-size: 14px; /* 设置字体大小 */
  color: #333; /* 设置字体颜色 */
}
</style>
