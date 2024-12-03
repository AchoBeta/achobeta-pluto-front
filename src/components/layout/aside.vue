<script setup>
import {
  HomeFilled,
  UserFilled,
} from '@element-plus/icons-vue';

const routers = [
  {
    path: '/login',
    name: '登录'
  }
];

// 独立的主页和团队信息项
const additionalItems = [
  {
    path: '/home',
    name: '主页',
    icon: HomeFilled
  },
  {
    path: '/team',
    name: '团队信息',
    icon: UserFilled
  }
];
</script>

<template v-slop="LayoutAside">
  <div class="container">
    <el-menu class="menu" default-active="1">
      <!-- 独立的“主页”和“团队信息”项 -->
      <template v-for="item in additionalItems" :key="item.path">
        <router-link :to="item.path">
          <el-menu-item :index="item.path">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </router-link>
      </template>
      
    </el-menu>
  </div>
</template>


<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100vh; /* 占满视口高度 */
  background-color: rgb(79, 157, 240); /* 蓝色背景 */
  overflow: hidden; /* 防止全局滚动 */
  position: relative; /* 确保子元素的定位以此为基准 */
  //border:solid 1px #ddd;
}

/* 菜单样式 */
.menu {
  position: fixed; /* 固定菜单 */
  top: 70px; /* 确保不与 header 重叠 */
  left: 0;
  width: 200px; /* 固定宽度 */
  height: calc(100vh - 60px); /* 剩余高度 */
  //background-color: #303133;
  overflow-y: auto; /* 当内容超出时滚动 */
  z-index: 1000; /* 确保菜单在 container 之上，但不会完全遮盖 */
  background-color: transparent; /* 透明背景，让蓝色背景可见 */
  border-right: 1px solid #e9e4e4; /* 分割线 */
  border:solid 2px #ddd;
}

/* 菜单按钮样式 */
.menu .el-menu-item {
  //background-color: #606266 !important; /* 按钮背景为灰色 */
  color: rgb(235.9, 245.3, 255) !important; /* 按钮文字为白色 */
  font-size:larger;
}

.menu .el-menu-item:hover,
.menu .el-menu-item.is-active {
  background-color: rgb(51.2, 126.4, 204) !important; /* 鼠标悬浮或激活时背景色 */
  color: #ffffff !important; /* 鼠标悬浮时文字颜色 */
}
</style>
