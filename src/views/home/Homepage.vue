<template>
    <div class="homepage">
      <div class="top-row">
        <PointsBox />
        <MessagesBox />
      </div>
      <div class="box progress-box">
        <Progress />
      </div>
    </div>
  </template>
  
  <script setup>
  import PointsBox from './components/PointsBox.vue';
  import MessagesBox from './components/MessagesBox.vue';
  import Progress from '@/views/home/components/ProgressBox.vue';
  </script>
  
  <style scoped>
  .homepage {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
    width: 100%;
  }
  
  .top-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    gap: 20px;
  }
  .progress-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    gap: 20px;
  }
  </style>
  