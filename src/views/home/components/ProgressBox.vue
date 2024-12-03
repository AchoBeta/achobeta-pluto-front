<script setup>
import { getProgressApi } from '@/axios/api/home'

const total_task_count = ref('0');
const incomplete_task_count = ref('0');
const upcoming_overdue_task_count = ref('0');
const overdue_task_count = ref('0');

onMounted(async () => {
  try{
    const data = await getProgressApi({'force-update':false});
    console.log('后端响应:', data.data);
    if(data.data.data == null){
      ElMessage.error('项目进度获取失败。');
    }
    else{
      total_task_count.value = data.data.data.total_task_count;
      incomplete_task_count.value = data.data.data.unfinished_task_count;
      upcoming_overdue_task_count.value = data.data.data.will_overdue_task_count;
      overdue_task_count.value = data.data.data.overdue_task_count;
    }
  }
  catch(error){
    ElMessage.error('项目进度获取失败。')
    console.error('Error fetching progress:', error);
  }});
</script>

<template>
  <slot name="Progress">
    <div class="progress-box">
      <div style="display: flex; align-items: center;">
      <el-icon class="calendar" size="24px"><Calendar /></el-icon>
      <h3 class="box-title" style="margin-left: 8px; cursor: default">项目进度</h3>
    </div>
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
              <span>未完成任务</span>
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

    </div>
  </slot>
</template>

<style scoped>

.progress-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
}
 
.box-title, .calendar {
  font-size: 1.7em;
  font-weight: 530;
  margin:20px;
  margin-right: 0px;
}

.calendar {
  color:blue;
}

.card-container {
  display: flex;
  flex-wrap: wrap; /* 允许子元素换行 */
  gap: 30px;
  width: 100%;
  margin-top: 10px;
  padding: 20px;
  position:relative;
  z-index: 1;
}
 
.progress-card {
  flex: 1 1 230px; /* 设置卡片的灵活宽度，最小宽度为230px */
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
  color: #333;
  line-height: 1;
  font-weight: 100;
  text-align: center;
  font-size: 2em;
}

.item-content {
  font-size: 2em;
}

.item-title {
  font-size: 1.7em;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center; 
}
</style>
