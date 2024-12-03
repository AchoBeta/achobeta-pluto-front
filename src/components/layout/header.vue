<script setup>
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { fetchNameApi, getDevicesApi, removeDeviceApi } from '@/axios/api/home'
import { exitSystem } from '@/components/layout/utils/Logout'; // 引入 exitSystem 函数
import dayjs from 'dayjs';

const router = useRouter();
const name = ref('林浅');

//// 导航到个人中心
const navigateToPersonalCenter = () => {
  router.push({ name: 'PersonalCenter' });
};

//// 退出登录
const handleLogout = async () => {
  try {
    // 调用 exitSystem 接口
    const result = await exitSystem();
    if (result.success) {
      ElMessage.success(result.message); // 成功提示
      clearLocalStorage();
      // 跳转到登录页面，确保用户无法通过返回按钮回到原页面
      router.replace('/login');
    } else {
      ElMessage.warning(result.message); // 警告提示
      if (result.code === -20000 || result.code === -20002) {
        clearLocalStorage();
        router.replace('/login');
      }
    }
  } catch (error) {
    console.error('退出登录出错:', error);
    ElMessage.error('退出失败，请稍后重试');
  } 
};
// 清理本地存储
const clearLocalStorage = () => {
  localStorage.removeItem('atoken');
  localStorage.removeItem('rtoken');
  localStorage.removeItem('userid');
  localStorage.removeItem('user_agent');
  localStorage.removeItem('ip');
};
  
////常用设备

//弹窗
const deviceDialogVisible = ref(false);

const showDeviceDialog = () => {
  deviceDialogVisible.value = true; // 显示对话框 骨架扇
  try {
      updateCurrentGridData();
    } catch (error) {
      // 处理获取设备数据时发生的错误
      ElMessage.error('成员信息获取失败。')
      console.error('Failed to update grid data:', error);
    }
  }
const currentGridData = ref([]);
for(let i = 0; i < currentGridData.value.length; i++){
      let time = currentGridData.value[i].online_time;
      currentGridData.value[i].online_time = dayjs(time).format('YYYY-MM-DD HH:mm:ss ');
    }
const service_id = localStorage.getItem('service_id');//当前设备
console.log('当前设备:',service_id);
//分页
const totalDevices = ref(10); // 假设总共有10台设备
const pageSize = 6; // 开发阶段为3，后期更改为每页显示5台设备 
const currentPage = ref(1); // 当前页码

//下线
const handleOffLine = async (id,index) => {
  try {
    console.log('下线设备-设备ID:',id);
    const response = await removeDeviceApi({id});
    console.log('下线设备-后端响应内容:', response.data); // 打印后端响应内容
    if(response.data.code === 20000){
      ElMessage.success('下线成功。');
      buttonStates.value[index] = true;
      // updateCurrentGridData();
    }}
  catch(error){
    ElMessage.error('下线失败。');
    console.error('Error fetching devices:', error);
  }
}

// 更新当前页数据
const buttonStates= ref([]);
const handlePageChange = (page) => {
  buttonStates.value = [];
  currentPage.value = page;
  updateCurrentGridData();
}
const updateCurrentGridData = async() => {
  try{
    const response = await getDevicesApi({page_number:currentPage.value,line_number:pageSize});
    console.log('更新常用设备列表-后端响应内容:', response.data); // 打印后端响应内容 
      currentGridData.value = response.data.data.devices;
      totalDevices.value = response.data.data.total;
      buttonStates.value = currentGridData.value.map(() => false);
      for(let i = 0; i < currentGridData.value.length; i++){
        if(!currentGridData.value[i].device_name) currentGridData.value[i].device_name = `设备${6*(currentPage.value-1)+(i+1)}`;
        let time = currentGridData.value[i].online_time;
        currentGridData.value[i].online_time = dayjs(time).format('YYYY-MM-DD HH:mm:ss ');
        }}
  catch(error){
    ElMessage.error('成员信息获取失败。');
    console.error('Error fetching devices:', error);
}}

////挂载
onMounted(async () => {
  try{
  const data = await fetchNameApi();
    console.log('获取用户姓名-后端响应:', data.data);
    if(data.data.data)
    name.value = data.data.data.name;
  else ElMessage.error('名字获取失败。');
}
  catch(error){
    ElMessage.error('名字获取失败。');
    console.error('Error fetching name:', error);
}})

</script>

<template>
    <el-header class="header">
      <el-dialog v-model="deviceDialogVisible" title="常用设备" width="800" style="cursor: default">
        <span>此处将显示所有您开启了“三十天内自动登录”的设备</span>
        <hr>
      <el-table :data="currentGridData">
        <el-table-column property="device_name" label="设备名称" width="150" />
        <el-table-column property="ip" label="上次登录IP" width="200" />
        <el-table-column property="online_time" label="上次登录时间" />
        <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button
          v-if="scope.row.id == service_id"
            type="text"
            size="small"
            :disabled="true"
          >
            当前设备
          </el-button>
          <el-button
              v-else-if="!buttonStates[scope.$index]"
              type="text"
              size="small"
              @click="handleOffLine(scope.row.id,scope.$index)"
            >
              下线
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              :disabled="true"
            >
              下线成功
            </el-button>
        </template>
      </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
      layout="prev, pager, next"
      :total="totalDevices"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />
    </el-dialog>

    <el-dropdown class="header-right" trigger="hover" placement="bottom-end">
        <span v-if="name" class="el-dropdown-link" style="cursor: pointer;">
        <span>欢迎回来，{{ name }}</span>
        <el-icon>
          <ArrowDown style="font-size: 20px; color: white;" />
        </el-icon>
      </span>
      <span v-else>加载中...</span><!--后期改为骨架屏-->
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="navigateToPersonalCenter">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item @click="showDeviceDialog">
            <el-icon><Monitor /></el-icon>
            <span>常用设备</span>
          </el-dropdown-item>
          <el-dropdown-item @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>

    </el-dropdown>
  </el-header>
</template>

<style scoped>
.header {
  position: fixed; /* 固定在视口顶部 */
  top: 0; /* 距离顶部 0 */
  left: 0; /* 左对齐 */
  width: 100%; /* 占满宽度 */
  height: 70px; /* 固定高度 */
  z-index: 1000; /* 确保层级在其他内容之上 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border:solid 2px #ddd;
}

.main-content {
  margin-top: 70px; /* 留出 header 的高度，避免内容被遮挡 */
  padding: 20px;
  overflow-y: auto; /* 启用垂直滚动，仅在内容超出时滚动 */
  height: calc(100vh - 70px); /* 高度为视口高度减去 header 的高度 */
}


.header-right {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgb(255, 255, 255);
  padding: 10px;
  border-radius: 5px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 20px;
  border: none !important; /* 取消边框 */
  outline: none !important; /* 取消轮廓线 */
}

.el-dropdown-link:hover {
  border: none !important; /* 取消边框 */
  outline: none !important; /* 取消轮廓线 */
}
</style>