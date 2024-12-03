<template>
    <div class="homepage">
      <div class="top-row">
        <PointsBox />
        <MessagesBox />
      </div>
      <div class="progress-box">
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
    padding: 10px;
    gap: 20px;
    width: 100%;
    height:100%;
  }

  .top-row , .progress-box{
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1300px;
    gap: 20px;
  }
  </style>
  