<script lang="ts" setup>
import LayoutAside from '@/components/layout/aside.vue';
import LayoutHeader from '@/components/layout/header.vue';
</script>

<template>
  <el-container class="common-layout">
    <!-- 头部，包含 LayoutHeader -->
    <el-header class="header">
      <LayoutHeader />
    </el-header>

    <el-container>
      <el-aside class="aside" width="200px">
        <LayoutAside />
      </el-aside>
      <el-main>
        <!-- 使用 router-view 显示当前路由的内容 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.common-layout {
  min-height: 100vh;
  width: 100%; /* 强制主布局宽度为 100% */

  .header {
    background-color: #409eff;
    width: 100%; /* 确保 header 宽度为 100% */
    box-sizing: border-box; /* 确保 padding 不影响宽度 */
  }

  .aside {
    background-color: aqua;
  }

  /* 确保内容容器占满 */
  .el-container {
    width: 100%;
  }
}
</style>
