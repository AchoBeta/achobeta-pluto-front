<script setup>
import { ref, onMounted,nextTick ,watch} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNewUser } from '../utils/new-user';
import axios from 'axios';
// 路由和逻辑方法
const route = useRoute();
const router = useRouter();

const { 
  formData,// 响应式表单数据对象
  initializeNewUser,// 初始化用户权限和团队信息
  resetForm, // 重置表单逻辑
  createTeamMember,// 保存数据逻辑
} = useNewUser(router);

// 性别的选项值
const selectedGender = ref("null"); // 默认值为 "null"
// 选中的角色（初始化为无权限）
const selectedRole = ref(0);

// 管理权限的选项
const roleOptions = ref([
  { label: '无权限', value: 0 },
  { label: '普通管理员', value: 1 }
]);

// 定义团队和职位的选项
const teamPositionOptions = ref([]); // 初始化为空数组
const teamPositionProps = ref({
  multiple: true,
  checkStrictly: false,
  emitPath: false, // 确保返回完整对象
});
const findNodeById = (id, nodes) => {
  for (const node of nodes) {
    if (node.value === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

// 选中的团队/职位
const selectedTeamPosition = ref([]);

// 获取团队职位数据
const fetchTeamStructure = async (teamId) => {
  try {
    const token = localStorage.getItem('atoken');
    const response = await axios.get('/api/team/structure/collection', {
      params: { team_id: teamId },
      headers: { Authorization: token },
    });

    if (response.data.code === 20000) {
      const teamStructures = response.data.data?.team_structures || [];
      const teamOptions = teamStructures.map((item) => ({
        value: item.myself_id,
        label: item.node_name,
        children: item.positions?.map((pos) => ({
          value: pos.position_id,
          label: pos.position_name,
        })) || [], // 确保 children 数据存在
      }));
      teamPositionOptions.value = [
        {
          value: teamId,
          label: route.params.teamName || '未知团队',
          children: teamOptions,
        },
      ];
    } else {
      ElMessage.error(response.data.message || '加载团队职位数据失败');
    }
  } catch (error) {
    ElMessage.error('加载团队职位数据失败，请稍后重试');
  }
};

// 监听选中团队职位变化
watch(selectedTeamPosition, (newValue) => {
  console.log('选中的团队职位 (调试):', JSON.stringify(newValue, null, 2));

  // 映射选中职位到完整的节点数据
  const mappedPositions = newValue.map((id) => {
    const node = findNodeById(id, teamPositionOptions.value[0]?.children || []);
    if (!node) {
      console.warn(`未找到职位 ID: ${id}`);
    }
    return node || { value: id, label: '未知职位' };
  });

  // 生成符合后端需求的 member_position 数据
  formData.value.member_position = mappedPositions.map((item) => ({
    team_id: route.params.teamId || null,
    team_name: route.params.teamName || null,
    position_node: [
      {
        position_id: item?.value || null,
        position_name: item?.label || null,
      },
    ],
    level: 1, // 默认级别
  }));

  console.log('生成的 member_position 数据:', JSON.stringify(formData.value.member_position, null, 2));
});

// 页面加载时执行
onMounted(async () => {
  const selectedTeamId = route.params.teamId; // 获取路由参数中的团队 ID
  const selectedTeamName = route.params.teamName; // 获取团队名称

  await fetchTeamStructure(selectedTeamId); // 加载团队职位数据
  initializeNewUser(selectedTeamId, selectedTeamName); // 初始化用户权限和团队信息
});

// 重置表单
const resetUserData = async () => {
  const selectedTeamId = route.params.teamId;
  const selectedTeamName = route.params.teamName;
  selectedTeamPosition.value = [];
  selectedRole.value = 0;
  selectedGender.value = 'null';
  await nextTick();
  await resetForm(selectedTeamId, selectedTeamName);
};

// 保存表单
const saveUserData = async () => {
  if (!formData.value.phone_num) {
    ElMessage.warning('请填写手机号码');
    return;
  }
  const success = await createTeamMember();// 保存数据到后端
  if (success) {
    ElMessage.success('数据保存成功');
  }
};
</script>

<template>
  <div class="personal-center">
    <div class="content-wrapper">
      <div class="header">
        <el-icon class="back-icon" @click="$router.push('/team')">
          <ArrowLeftBold />
        </el-icon>
        <div class="title-with-icon">
          <h2>个人信息</h2>
          <img src="@/assets/icons/personal-center-pepole.svg" alt="用户图标" class="info-icon" />
        </div>
        <div class="action-section">
          <el-button type="info" @click="resetUserData" class="reset-button">重置</el-button>
          <el-button type="primary" @click="saveUserData" class="save-button">保存</el-button>
        </div>
      </div>

      <!-- 使用 el-scrollbar 包裹内容区域 -->
      <div class="info-box">
           <div class="scrollbar-content">
          <div class="info-section">
            <!-- 通用行 -->
            <div class="info-row">
              <div>
                <span>真实姓名</span>
                <el-input v-model="formData.name" style="width: 240px" size="large"/>
              </div>
              <div>
                <span>性别</span>
                <el-select v-model="formData.sex" size="large" style="width: 130px">
                  <el-option label="未选择" value="null" />
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </div>
            </div>

            <!-- 第三行 -->
            <div class="info-row">
              <div>
                <span>加入时间</span>
                <el-input v-model="formData.create_date" placeholder="YYYY-MM-DD" style="width: 240px" size="large"/>
              </div>
              <div>
                <span>所属团队/职位</span>
                <div class="m-4">
                    <el-cascader 
                      :options="teamPositionOptions" 
                      :props="teamPositionProps" 
                      clearable 
                      v-model="selectedTeamPosition" 
                      size="large" 
                     />
                </div>
              </div>
              <div>
                <div>
                <span>管理权限</span>
                <el-select v-model="selectedRole" size="large" style="width: 205px">
                  <el-option
                    v-for="option in roleOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </div>
              </div>
            </div>

            <div class="info-row">
              <div>
                <span>身份证号</span>
                <el-input v-model="formData.id_card" style="width: 240px" size="large"/>
              </div>
              <div>
                <div class="field-label">
                  <span>手机号码</span>
                  <span class="required">*</span>
                </div>
                <el-input v-model="formData.phone_num" style="width: 240px" size="large"/>
              </div>
              <div>
                <span>邮箱</span>
                <el-input v-model="formData.email" style="width: 240px" size="large"/>
              </div>
            </div>

            <div class="info-row">
              <div>
                <span>年级</span>
                <el-input v-model="formData.grade" style="width: 240px" size="large"/>
              </div>
              <div>
                <span>专业</span>
                <el-input v-model="formData.major" style="width: 240px" size="large"/>
              </div>
              <div>
                <span>学号</span>
                <el-input v-model="formData.student_id" style="width: 240px" size="large"/>
              </div>
            </div>

            <!-- 第六行 -->
            <div class="info-row">
              <div style="grid-column: 1 / 4; text-align: left;">
                <span>实习、创业、就职经历</span>
                <el-input v-model="formData.experience" type="textarea" :rows="5"/>
              </div>
            </div>

            <!-- 最后一行 -->
            <div class="info-row">
              <div style="grid-column: 1 / 4; text-align: left;">
                <span>现状</span>
                <el-input v-model="formData.status" type="textarea" :rows="4"/>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal-center {
  background-color: #f4f4f4;
}

.content-wrapper {
  background: linear-gradient(to bottom, #fdf6f0, #d7e3fc);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 0 auto;
  position: relative; /* 添加相对定位 */
}

.back-icon {
  font-size: 26px;
  color: #333;
  cursor: pointer;
  margin-top: 2px;
}

.back-icon:hover {
  color: #409eff;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
}

.title-with-icon {
  display: flex;
  gap: 10px;
}

.title-with-icon h2 {
  font-size: 1.7em;
  font-weight: 550;
  color: #333;
  margin: 0;
}

.title-with-icon .info-icon {
  width: 45px;
  transition: transform 0.3s;
}

.title-with-icon .info-icon:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.save-button {
  height: 35px;
  width: 80px;
  margin-right: 50px;
}

.reset-button {
  background-color: #c6c0c0ec;
  color: black;
  height: 35px;
  width: 80px;
  margin-right: 15px;
}

.info-box {
  margin-top: 20px;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

/* 内容容器样式 */
.scrollbar-content {
  padding: 0 140px 20px 120px; /* 左右添加足够的内边距，右侧多加一些为滚动条预留空间 */
  box-sizing: border-box;
}


.custom-scrollbar ::v-deep(.el-scrollbar__bar.is-vertical) {
  width: 6px; /* 调整垂直滚动条宽度 */
  right: 20px; /* 将滚动条向右移动一些距离 */
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width:100%;
}

.info-row {
  display: grid;
  grid-template-columns: 240px 240px 240px;
  gap: 171px;
  align-items: start;
  width:100%;
}

.info-row div {
  text-align: left;
  padding: 0;
  margin: 0;
}

.info-row span {
  font-weight: 545;
  font-size: 1.1em;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.el-input {
  display: block;
  width: 100%;
}

.field-label {
  position: relative;
  display: inline-block;
  font-size: 1.1em;
}

.field-label .required {
  color: red;
  font-size: 1.2em;
  position: absolute;
  top: 0;
  right: -12px;
}

.info-row div div {
  font-size: 0.9em;
  color: #333;
}
</style>