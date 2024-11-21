<template>
  <div class="box points-box">
    <h3 class="box-title">积分情况</h3>
    <div class="points-details">
      <div
        class="points-item"
        v-for="(point, index) in pointsData"
        :key="index"
        :class="point.backgroundClass"
      >

      <!-- 图标，本月新增框 -->
      <img
          v-if="index === 0"
          src="@/assets/icons/home-add.svg"
          class="add-icon"
          alt="add icon"
        />

      <!-- 图标，剩余积分框 -->
      <img
          v-if="index === 2"
          src="@/assets/icons/home-leave.svg"
          class="left-icon"
          alt="leave icon"
        />

        <!-- 图标，排名框 -->
        <img
          v-if="index === 1"
          src="@/assets/icons/home-rank.svg"
          class="side-icon"
          alt="rank icon"
        />
        <!-- 图标，累计积分框 -->
        <img
          v-if="index === 3"
          src="@/assets/icons/home-accumulate.svg"
          class="accumulate-icon"
          alt="accumulate icon"
        />

        <!-- 文字部分 -->
        <div class="text-content">
          <span class="item-title">{{ point.title }}</span>
          <div class="item-content">{{ point.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPoints } from '../utils/getPoints';

// 获取用户ID
const userId = localStorage.getItem('userid');

// 定义积分数据
const pointsData = ref([
  { title: '本月新增', value: '00', backgroundClass: 'bg-blue' },
  { title: '本月排名', value: '00', backgroundClass: 'bg-green' },
  { title: '剩余积分', value: '00', backgroundClass: 'bg-orange' },
  { title: '累计积分', value: '00', backgroundClass: 'bg-purple' },
]);

// 动态获取积分数据
onMounted(async () => {
  const points = await getPoints(userId);
  if (points) {
    pointsData.value[0].value = points.monthly_points || '00';
    pointsData.value[1].value = points.monthly_ranking || '00';
    pointsData.value[2].value = points.current_points || '00';
    pointsData.value[3].value = points.total_points || '00';
  }
});
</script>

<style scoped>
/* 主框样式 */
.box {
  background-color: #e8d14f79;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1;
}

.box-title {
  font-size: 1.7em;
  font-weight: 530;
  margin-bottom: 15px;
  margin-top: 0;
  text-align: center;
  color: #333;
}

/* 网格布局 */
.points-details {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列布局 */
  gap: 20px;
  height: calc(100% - 60px);
}

/* 子框样式 */
.points-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #fff; /* 子框内文字颜色为白色 */
  position: relative; /* 为图标的定位做准备 */
  transition: transform 0.5s ease, box-shadow 0.4s ease;
}

.points-item:hover {
  transform: translateY(-5px);
}

.bg-blue {
  background-color: #87CEEB; /* 天蓝色 */
}

.bg-green {
  background-color: #90EE90; /* 柔和薄荷绿 */
}

.bg-orange {
  background-color: #FFA07A; /* 浅橙色 */
}

.bg-purple {
  background-color: #BA55D3; /* 中紫色 */
}

/* 文字部分 */
.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  flex: 1; /* 占满剩余空间 */
  margin-left: 100px; /* 向右移动文字部分 */
}

/* 本月新增框图标样式 */
.add-icon {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 10px; /* 距离左侧的间距 */
  transform: translateY(-50%); /* 垂直方向调整居中 */
  width: 60px; /* 图标宽度 */
  height: 60px; /* 图标高度 */
  z-index: 10; /* 确保图标显示在内容之上 */
  margin-left: 20px;
}

/* 排名框图标样式 */
.side-icon {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 10px; /* 距离右侧的间距 */
  transform: translateY(-50%); /* 垂直方向调整居中 */
  width: 80px !important; /* 图标宽度 */
  height: 80px !important; /* 图标高度 */
  z-index: 10; /* 确保图标显示在内容之上 */
  margin-left: 20px;
}

/* 剩余积分框图标样式 */
.left-icon {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 10px; /* 距离左侧的间距 */
  transform: translateY(-50%); /* 垂直方向调整居中 */
  width: 70px; /* 图标宽度 */
  height: 70px; /* 图标高度 */
  z-index: 10; /* 确保图标显示在内容之上 */
  margin-left: 20px;
}

/* 累计积分框图标样式 */
.accumulate-icon {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 10px; /* 距离右侧的间距 */
  transform: translateY(-50%); /* 垂直方向调整居中 */
  width: 70px; /* 图标宽度 */
  height: 70px; /* 图标高度 */
  z-index: 10; /* 确保图标显示在内容之上 */
  margin-left: 20px;
}

/* 标题样式 */
.item-title {
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 10px;
}

/* 图标样式 */
.side-icon {
  width: 20px; /* 图标大小 */
  height: 20px;
}

/* 内容样式 */
.item-content {
  font-size: 2.5em;
  font-weight: bold;
  line-height: 1.2;
}
</style>