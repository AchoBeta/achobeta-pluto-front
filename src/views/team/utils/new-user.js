import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref , watch , toRaw ,nextTick} from 'vue';

export const useNewUser = (router) => {
  const formData = ref({
    name: '',
    sex: '',
    create_date: '',
    id_card: '',
    phone_num: '', // 必填
    email: '',
    grade: '',
    major: '',
    student_id: '',
    experience: '',
    status: '',
    member_position: [], // 团队及职位信息
  });

  // 级联选择器相关变量
  const selectedTeamPosition = ref([]);
  const selectedRole = ref(0);

  // 用于跟踪表单是否被修改
  const isFormModified = ref(false);

   // 深度清理对象中的 null 值
  const cleanRequestData = (data) => {
    const fieldsToNullify = ['id_card', 'email', 'student_id'];
    if (Array.isArray(data)) {
      return data.map((item) => cleanRequestData(item));
    } else if (data && typeof data === 'object') {
      const cleanedData = {};
      for (const key in data) {
        if (fieldsToNullify.includes(key)) {
          cleanedData[key] = data[key] ? data[key] : null;
        } else {
          cleanedData[key] = data[key] === null || data[key] === undefined ? '' : data[key];
        }
      }
      return cleanedData;
    }
    return data;
  };
  
  const initializeNewUser = async (selectedTeamId, selectedTeamName) => {
    const defaultPosition = {
      team_id: selectedTeamId || null,
      team_name: selectedTeamName || null,
      position_node: [], // 默认空职位列表
    };
    formData.value.member_position = selectedTeamId ? [defaultPosition] : [];
    selectedTeamPosition.value = selectedTeamId
      ? [{
          value: selectedTeamId,
          label: selectedTeamName || null,
          children: [],
        }]
      : [];
  };

    /**
   * 重置表单数据
   */
  const resetForm = async (selectedTeamId, selectedTeamName) => {
    formData.value = {
      name: '',
      sex: '',
      create_date: '',
      id_card: '',
      phone_num: '',
      email: '',
      grade: '',
      major: '',
      student_id: '',
      experience: '',
      status: '',
      member_position: [], 
    };
    selectedTeamPosition.value = []; // 清空级联选择器选中值
    selectedRole.value = 0; // 重置管理权限
    isFormModified.value = false;

    // 重新初始化团队信息
    await initializeNewUser(selectedTeamId, selectedTeamName);
  };

  /**
   * 验证表单字段
   */
  const validateForm = () => {
    if (!formData.value.phone_num) {
      ElMessage.warning('请填写手机号码');
      return false;
    }
    return true;
  };

  /**
 * 创建团队成员
 * @param {Array} memberPosition - 来自第一段代码的职位数据
 */
  const createTeamMember = async (memberPosition = null) => {
    if (!validateForm()) return false;
  
    const atoken = localStorage.getItem('atoken');
    if (!atoken) {
      ElMessage.error('未检测到登录信息，请重新登录');
      return false;
    }
  
    const formattedPositionData = (memberPosition || formData.value.member_position).map((position) => ({
      team_id: Number(position.team_id) || null,
      team_name: position.team_name || null,
      position_node: position.position_node?.map((node) => ({
        position_id: Number(node.position_id) || null,
        position_name: node.position_name || null,
      })) || [],
      level: position.level || 1,
    }));
  
    const requestData = cleanRequestData({
      ...formData.value,
      team_id: formattedPositionData.length > 0 ? Number(formattedPositionData[0].team_id) : null, // 从第一个 member_position 提取 team_id
      member_position: formattedPositionData,
    });
  
    console.log('发送到后端的请求数据:', requestData);
  
    try {
      const response = await axios.post('/api/team/memberlist/create', requestData, {
        headers: { Authorization: atoken },
      });
  
      console.log('后端返回的请求数据:', response);

      if (response.data.code === 20000) {
        ElMessage.success('创建成员成功');
        isFormModified.value = false;
        return true;
      } else {
        ElMessage.error(response.data.message || '创建成员失败');
      }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '请求失败，请稍后重试');
    }
    return false;
  };
  
  watch(formData, () => {
    isFormModified.value = true;
  }, { deep: true });

  watch(selectedTeamPosition, (newValue) => {
    console.log('级联选择器选中的值 (原始):', JSON.stringify(toRaw(newValue), null, 2)); // 打印原始数据
    formData.value.member_position = newValue.map((item) => {
      const positionNode = item.children?.map((node) => ({
        position_id: node.value || null,
        position_name: node.label || null,
      })) || [];
      return {
        team_id: item.value || null,
        team_name: item.label || null,
        position_node: positionNode,
        level: 1,
      };
    });
    console.log('生成的 member_position 数据 (原始):', JSON.stringify(toRaw(formData.value.member_position), null, 2));
  }, { deep: true });

  return {
    formData,
    selectedTeamPosition, 
    selectedRole,
    isFormModified,
    initializeNewUser,
    resetForm,
    createTeamMember,
  };
};


