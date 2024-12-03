/* __placeholder__ */
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNewUser } from '../utils/new-user';
import axios from 'axios';
import apiClient from '@/axios/axios';
import _ from 'lodash'; // 引入 lodash
// 导入点赞前后的 SVG 图标
import hand1 from '@/assets/icons/personal-center-hand1.svg';
import hand2 from '@/assets/icons/personal-center-hand2.svg';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// 路由和逻辑方法
const route = useRoute();
const router = useRouter();
const props = defineProps({
    id: { type: String, default: '' },
    teamId: { type: String, default: '' },
    teamName: { type: String, default: '' },
    level: { type: [String, Number], default: '' },
});
console.log('接收到的参数:', props.id, props.teamId, props.teamName, props.level);
// 定义响应式变量
const likeCount = ref(0); // 点赞数
const isLiked = ref(false); // 点赞状态
const { formData, // 响应式表单数据对象
initializeNewUser, // 初始化用户权限和团队信息
resetForm, // 重置表单逻辑
createTeamMember, // 保存数据逻辑
 } = useNewUser(router);
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
            if (found)
                return found;
        }
    }
    return null;
};
// 选中的团队/职位
const selectedTeamPosition = ref([]);
// 获取团队职位数据
const fetchTeamStructure = async () => {
    try {
        const token = localStorage.getItem('atoken');
        const response = await axios.get('/api/team/structure/collection', {
            params: { team_id: props.teamId },
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
                    value: props.teamId,
                    label: props.teamName || null,
                    children: teamOptions,
                },
            ];
        }
        else {
            ElMessage.error(response.data.message || '加载团队职位数据失败');
        }
    }
    catch (error) {
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
        return node || { value: id, label: null };
    });
    // 生成符合后端需求的 member_position 数据
    formData.value.member_position = mappedPositions.map((item) => ({
        team_id: props.teamId || null,
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
// 获取用户数据函数
async function fetchUserData() {
    try {
        const response = await apiClient.get('/api/team/membermsg/details', {
            params: {
                member_id: props.id,
            },
        });
        console.log('获取用户点赞数据:', response.data);
        const { code, data } = response.data;
        if (code === 20000) {
            likeCount.value = data.like_count || 0; // 初始化点赞数
            isLiked.value = data.is_liked === 1; // 初始化点赞状态
        }
        else {
            ElMessage.error('加载用户数据失败');
        }
    }
    catch (error) {
        console.error('加载用户数据失败:', error);
        ElMessage.error('网络错误，请稍后重试');
    }
}
// 点赞切换逻辑
const handleLike = async () => {
    const originalLiked = isLiked.value;
    const originalLikeCount = likeCount.value;
    // 本地立即切换状态
    isLiked.value = !isLiked.value;
    likeCount.value += isLiked.value ? 1 : -1;
    try {
        const response = await apiClient.put('/api/team/membermsg/like', {
            member_id: Number(props.id), // Body 参数
        });
        const { code, message, data } = response.data;
        console.log('点赞请求:', response.data);
        if (code === 20000) {
            // 更新点赞数为后端返回的值
            likeCount.value = data.like_count || 0; // 更新点赞数
            isLiked.value = data.like_count > 0; // 更新点赞状态
        }
        else {
            console.error('点赞请求失败:', message);
            // 如果后端返回非成功状态，恢复原始状态
            isLiked.value = originalLiked;
            likeCount.value = originalLikeCount;
            // 根据返回的具体错误码，提示用户
            handleLikeError(code, message);
        }
    }
    catch (error) {
        console.error('点赞请求时出错:', error);
        // 请求失败时恢复原始状态
        isLiked.value = originalLiked;
        likeCount.value = originalLikeCount;
        // 提示用户网络或其他错误
        ElMessage.error('网络错误，请稍后重试');
    }
};
// 防抖处理
const toggleLike = _.debounce(handleLike, 1000); // 防抖时间为 1000 毫秒
// 错误处理函数
function handleLikeError(code, message) {
    switch (code) {
        case 10001:
            ElMessage.error('参数无效，请联系管理员');
            break;
        case 60003:
        case 20013:
            ElMessage.error('操作被锁定，请稍后再试');
            break;
        case 40014:
            ElMessage.error('用户不存在，请检查用户信息');
            break;
        case 40013:
            ElMessage.error('用户查询失败，请稍后重试');
            break;
        default:
            ElMessage.error(message || '未知错误，请稍后重试');
    }
}
// 页面加载时获取用户数据
onMounted(async () => {
    await fetchUserData(); // 初始化点赞数据
    const selectedTeamId = props.teamId;
    const selectedTeamName = props.teamName;
    await fetchTeamStructure(selectedTeamId); // 加载团队职位数据
    initializeNewUser(selectedTeamId, selectedTeamName); // 初始化用户权限和团队信息
});
// 重置表单
const resetUserData = async () => {
    const selectedTeamId = selectedTeamId;
    const selectedTeamName = selectedTeamName;
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
    const success = await createTeamMember(); // 保存数据到后端
    if (success) {
        ElMessage.success('数据保存成功');
    }
};
const __VLS_fnComponent = (await import('vue')).defineComponent({
    props: {
        id: { type: String, default: '' },
        teamId: { type: String, default: '' },
        teamName: { type: String, default: '' },
        level: { type: [String, Number], default: '' },
    },
});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("personal-center") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("content-wrapper") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("header") }, });
    // @ts-ignore
    const __VLS_0 = {}
        .ElIcon;
    ({}.ElIcon);
    ({}.ElIcon);
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    __VLS_components.ElIcon;
    __VLS_components.elIcon;
    // @ts-ignore
    [ElIcon, ElIcon,];
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, ...{ class: ("back-icon") }, }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, ...{ class: ("back-icon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ 'onClick': {} }, ...{ class: ("back-icon") }, }));
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/team');
            // @ts-ignore
            [$router,];
        }
    };
    const __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2));
    let __VLS_3;
    let __VLS_4;
    // @ts-ignore
    const __VLS_8 = {}
        .ArrowLeftBold;
    ({}.ArrowLeftBold);
    __VLS_components.ArrowLeftBold;
    // @ts-ignore
    [ArrowLeftBold,];
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    ({}({}));
    const __VLS_13 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10));
    __VLS_nonNullable(__VLS_5.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("title-with-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/icons/personal-center-pepole.svg"), alt: ("用户图标"), ...{ class: ("info-icon") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("action-section") }, });
    // @ts-ignore
    const __VLS_14 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({ ...{ 'onClick': {} }, type: ("info"), ...{ class: ("reset-button") }, }));
    const __VLS_16 = __VLS_15({ ...{ 'onClick': {} }, type: ("info"), ...{ class: ("reset-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    ({}({ ...{ 'onClick': {} }, type: ("info"), ...{ class: ("reset-button") }, }));
    let __VLS_20;
    const __VLS_21 = {
        onClick: (__VLS_ctx.resetUserData)
    };
    const __VLS_19 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16));
    let __VLS_17;
    let __VLS_18;
    // @ts-ignore
    [resetUserData,];
    __VLS_nonNullable(__VLS_19.slots).default;
    // @ts-ignore
    const __VLS_22 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save-button") }, }));
    const __VLS_24 = __VLS_23({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    ({}({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save-button") }, }));
    let __VLS_28;
    const __VLS_29 = {
        onClick: (__VLS_ctx.saveUserData)
    };
    const __VLS_27 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24));
    let __VLS_25;
    let __VLS_26;
    // @ts-ignore
    [saveUserData,];
    __VLS_nonNullable(__VLS_27.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.toggleLike) }, ...{ class: ("like-button") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.isLiked ? __VLS_ctx.hand2 : __VLS_ctx.hand1)), alt: ("点赞图标"), ...{ class: ("like-icon") }, });
    // @ts-ignore
    [toggleLike, isLiked, hand2, hand1,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("like-count") }, });
    (__VLS_ctx.likeCount);
    // @ts-ignore
    [likeCount,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("scrollbar-content") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-section") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_30 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ modelValue: ((__VLS_ctx.formData.name)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_32 = __VLS_31({ modelValue: ((__VLS_ctx.formData.name)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    ({}({ modelValue: ((__VLS_ctx.formData.name)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_35 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_36 = {}
        .ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ modelValue: ((__VLS_ctx.formData.sex)), size: ("large"), ...{ style: ({}) }, }));
    const __VLS_38 = __VLS_37({ modelValue: ((__VLS_ctx.formData.sex)), size: ("large"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    ({}({ modelValue: ((__VLS_ctx.formData.sex)), size: ("large"), ...{ style: ({}) }, }));
    const __VLS_41 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38));
    // @ts-ignore
    const __VLS_42 = {}
        .ElOption;
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption,];
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ label: ("未选择"), value: ("null"), }));
    const __VLS_44 = __VLS_43({ label: ("未选择"), value: ("null"), }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    ({}({ label: ("未选择"), value: ("null"), }));
    const __VLS_47 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_42, __VLS_44));
    // @ts-ignore
    [formData,];
    // @ts-ignore
    const __VLS_48 = {}
        .ElOption;
    ({}.ElOption);
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption, ElOption,];
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ label: ("男"), value: ("男"), }));
    const __VLS_50 = __VLS_49({ label: ("男"), value: ("男"), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    ({}({ label: ("男"), value: ("男"), }));
    const __VLS_53 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50));
    // @ts-ignore
    const __VLS_54 = {}
        .ElOption;
    ({}.ElOption);
    ({}.ElOption);
    __VLS_components.ElOption;
    __VLS_components.elOption;
    __VLS_components.ElOption;
    __VLS_components.elOption;
    // @ts-ignore
    [ElOption, ElOption,];
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ label: ("女"), value: ("女"), }));
    const __VLS_56 = __VLS_55({ label: ("女"), value: ("女"), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    ({}({ label: ("女"), value: ("女"), }));
    const __VLS_59 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56));
    __VLS_nonNullable(__VLS_41.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_60 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ modelValue: ((__VLS_ctx.formData.create_date)), placeholder: ("YYYY-MM-DD"), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_62 = __VLS_61({ modelValue: ((__VLS_ctx.formData.create_date)), placeholder: ("YYYY-MM-DD"), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    ({}({ modelValue: ((__VLS_ctx.formData.create_date)), placeholder: ("YYYY-MM-DD"), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_65 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("m-4") }, });
    // @ts-ignore
    const __VLS_66 = {}
        .ElCascader;
    ({}.ElCascader);
    __VLS_components.ElCascader;
    __VLS_components.elCascader;
    // @ts-ignore
    [ElCascader,];
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({ options: ((__VLS_ctx.teamPositionOptions)), props: ((__VLS_ctx.teamPositionProps)), clearable: (true), modelValue: ((__VLS_ctx.selectedTeamPosition)), size: ("large"), }));
    const __VLS_68 = __VLS_67({ options: ((__VLS_ctx.teamPositionOptions)), props: ((__VLS_ctx.teamPositionProps)), clearable: (true), modelValue: ((__VLS_ctx.selectedTeamPosition)), size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    ({}({ options: ((__VLS_ctx.teamPositionOptions)), props: ((__VLS_ctx.teamPositionProps)), clearable: (true), modelValue: ((__VLS_ctx.selectedTeamPosition)), size: ("large"), }));
    const __VLS_71 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_66, __VLS_68));
    // @ts-ignore
    [teamPositionOptions, teamPositionProps, selectedTeamPosition,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_72 = {}
        .ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({ modelValue: ((__VLS_ctx.selectedRole)), size: ("large"), ...{ style: ({}) }, }));
    const __VLS_74 = __VLS_73({ modelValue: ((__VLS_ctx.selectedRole)), size: ("large"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    ({}({ modelValue: ((__VLS_ctx.selectedRole)), size: ("large"), ...{ style: ({}) }, }));
    const __VLS_77 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_72, __VLS_74));
    for (const [option] of __VLS_getVForSourceType((__VLS_ctx.roleOptions))) {
        // @ts-ignore
        const __VLS_78 = {}
            .ElOption;
        ({}.ElOption);
        __VLS_components.ElOption;
        __VLS_components.elOption;
        // @ts-ignore
        [ElOption,];
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ key: ((option.value)), label: ((option.label)), value: ((option.value)), }));
        const __VLS_80 = __VLS_79({ key: ((option.value)), label: ((option.label)), value: ((option.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        ({}({ key: ((option.value)), label: ((option.label)), value: ((option.value)), }));
        const __VLS_83 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80));
        // @ts-ignore
        [selectedRole, roleOptions,];
    }
    __VLS_nonNullable(__VLS_77.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_84 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({ modelValue: ((__VLS_ctx.formData.id_card)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_86 = __VLS_85({ modelValue: ((__VLS_ctx.formData.id_card)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    ({}({ modelValue: ((__VLS_ctx.formData.id_card)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_89 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_84, __VLS_86));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("field-label") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("required") }, });
    // @ts-ignore
    const __VLS_90 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ modelValue: ((__VLS_ctx.formData.phone_num)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_92 = __VLS_91({ modelValue: ((__VLS_ctx.formData.phone_num)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    ({}({ modelValue: ((__VLS_ctx.formData.phone_num)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_95 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_96 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ modelValue: ((__VLS_ctx.formData.email)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_98 = __VLS_97({ modelValue: ((__VLS_ctx.formData.email)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    ({}({ modelValue: ((__VLS_ctx.formData.email)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_101 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_102 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ modelValue: ((__VLS_ctx.formData.grade)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_104 = __VLS_103({ modelValue: ((__VLS_ctx.formData.grade)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    ({}({ modelValue: ((__VLS_ctx.formData.grade)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_107 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_108 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({ modelValue: ((__VLS_ctx.formData.major)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_110 = __VLS_109({ modelValue: ((__VLS_ctx.formData.major)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    ({}({ modelValue: ((__VLS_ctx.formData.major)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_113 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_114 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ modelValue: ((__VLS_ctx.formData.student_id)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_116 = __VLS_115({ modelValue: ((__VLS_ctx.formData.student_id)), ...{ style: ({}) }, size: ("large"), }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    ({}({ modelValue: ((__VLS_ctx.formData.student_id)), ...{ style: ({}) }, size: ("large"), }));
    const __VLS_119 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_120 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({ modelValue: ((__VLS_ctx.formData.experience)), type: ("textarea"), rows: ((5)), }));
    const __VLS_122 = __VLS_121({ modelValue: ((__VLS_ctx.formData.experience)), type: ("textarea"), rows: ((5)), }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    ({}({ modelValue: ((__VLS_ctx.formData.experience)), type: ("textarea"), rows: ((5)), }));
    const __VLS_125 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_120, __VLS_122));
    // @ts-ignore
    [formData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    const __VLS_126 = {}
        .ElInput;
    ({}.ElInput);
    __VLS_components.ElInput;
    __VLS_components.elInput;
    // @ts-ignore
    [ElInput,];
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({ modelValue: ((__VLS_ctx.formData.status)), type: ("textarea"), rows: ((4)), }));
    const __VLS_128 = __VLS_127({ modelValue: ((__VLS_ctx.formData.status)), type: ("textarea"), rows: ((4)), }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    ({}({ modelValue: ((__VLS_ctx.formData.status)), type: ("textarea"), rows: ((4)), }));
    const __VLS_131 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_126, __VLS_128));
    // @ts-ignore
    [formData,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['personal-center'];
        __VLS_styleScopedClasses['content-wrapper'];
        __VLS_styleScopedClasses['header'];
        __VLS_styleScopedClasses['back-icon'];
        __VLS_styleScopedClasses['title-with-icon'];
        __VLS_styleScopedClasses['info-icon'];
        __VLS_styleScopedClasses['action-section'];
        __VLS_styleScopedClasses['reset-button'];
        __VLS_styleScopedClasses['save-button'];
        __VLS_styleScopedClasses['like-button'];
        __VLS_styleScopedClasses['like-icon'];
        __VLS_styleScopedClasses['like-count'];
        __VLS_styleScopedClasses['info-box'];
        __VLS_styleScopedClasses['scrollbar-content'];
        __VLS_styleScopedClasses['info-section'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['m-4'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['field-label'];
        __VLS_styleScopedClasses['required'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['info-row'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                $props: __VLS_makeOptional(props),
                ...props,
                hand1: hand1,
                hand2: hand2,
                likeCount: likeCount,
                isLiked: isLiked,
                formData: formData,
                selectedRole: selectedRole,
                roleOptions: roleOptions,
                teamPositionOptions: teamPositionOptions,
                teamPositionProps: teamPositionProps,
                selectedTeamPosition: selectedTeamPosition,
                toggleLike: toggleLike,
                resetUserData: resetUserData,
                saveUserData: saveUserData,
            };
        },
    });
}
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
        };
    },
});
;
