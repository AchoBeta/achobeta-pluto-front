/* __placeholder__ */
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/axios/axios';
import _ from 'lodash'; // 引入 lodash
// 导入点赞前后的 SVG 图标
import hand1 from '@/assets/icons/personal-center-hand1.svg';
import hand2 from '@/assets/icons/personal-center-hand2.svg';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const props = defineProps({
    id: { type: String, default: '' },
    teamId: { type: String, default: '' },
    teamName: { type: String, default: '' },
    level: { type: [String, Number], default: '' },
});
console.log('接收到的参数:', props.id, props.teamId, props.teamName, props.level);
// 定义响应式变量
const userData = ref({}); // 用户个人信息
const likeCount = ref(0); // 点赞数
const isLiked = ref(false); // 点赞状态
// 获取用户数据函数
async function fetchUserData() {
    try {
        const response = await apiClient.get('/api/user-profile/details', {
            params: { member_id: props.id }, // 使用 props.id 作为参数
        });
        console.log('获取用户数据:', response);
        const { code, message, data } = response.data;
        if (response.data.code === 20000) {
            const data = response.data.data;
            // 处理所属团队及职位信息
            if (data.member_position && Array.isArray(data.member_position)) {
                data.member_position = data.member_position.map((team) => {
                    const positions = team.position_node
                        .map((pos) => pos.position_name)
                        .join('，'); // 使用顿号分隔多个职位
                    return `${team.team_name}（${positions}）`; // 输出格式：团队名（职位1，职位2）
                }).join('；'); // 使用分号分隔多个团队
            }
            userData.value = data;
            likeCount.value = data.like_count || 0;
            isLiked.value = data.is_liked === 1;
        }
        else if (code === 10001) {
            ElMessage.error('参数无效，请检查输入');
        }
        else if (code === 40014) {
            ElMessage.error('用户不存在');
        }
        else if (code === 40013) {
            ElMessage.error('用户查询失败');
        }
        else {
            ElMessage.error(`未知错误：${message}`);
        }
    }
    catch (error) {
        console.error('获取用户数据失败:', error);
        ElMessage.error('加载用户数据失败，请稍后重试');
    }
}
;
// 点赞切换逻辑
const handleLike = async () => {
    // 本地立即切换状态
    const originalLiked = isLiked.value;
    const originalLikeCount = likeCount.value;
    isLiked.value = !isLiked.value;
    likeCount.value += isLiked.value ? 1 : -1;
    try {
        const response = await apiClient.put('/api/team/membermsg/like', {
            member_id: Number(props.id), // Body 参数
        });
        const { code, message, data } = response.data;
        console.log('点赞请求:', response.data);
        if (code === 20000) {
            likeCount.value = data.like_count || 0; // 更新点赞数为后端返回的值
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
        console.error('点赞请求失败:', error);
        // 恢复原始状态
        isLiked.value = originalLiked;
        likeCount.value = originalLikeCount;
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
onMounted(() => {
    fetchUserData();
});
// 时间格式化工具函数
function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.toggleLike) }, ...{ class: ("like-button") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.isLiked ? __VLS_ctx.hand2 : __VLS_ctx.hand1)), alt: ("点赞图标"), ...{ class: ("like-icon") }, });
    // @ts-ignore
    [toggleLike, isLiked, hand2, hand1,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("like-count") }, });
    (__VLS_ctx.likeCount);
    // @ts-ignore
    [likeCount,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-section") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.name || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.sex || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.create_date ? __VLS_ctx.formatDate(__VLS_ctx.userData.create_date) : '未填写');
    // @ts-ignore
    [userData, userData, formatDate,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.member_position || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.id_card || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.phone_num || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.email || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.grade || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.major || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.student_id || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.experience || '未填写');
    // @ts-ignore
    [userData,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info-row") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.userData.status || '未填写');
    // @ts-ignore
    [userData,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['personal-center'];
        __VLS_styleScopedClasses['content-wrapper'];
        __VLS_styleScopedClasses['header'];
        __VLS_styleScopedClasses['back-icon'];
        __VLS_styleScopedClasses['title-with-icon'];
        __VLS_styleScopedClasses['info-icon'];
        __VLS_styleScopedClasses['action-section'];
        __VLS_styleScopedClasses['like-button'];
        __VLS_styleScopedClasses['like-icon'];
        __VLS_styleScopedClasses['like-count'];
        __VLS_styleScopedClasses['info-box'];
        __VLS_styleScopedClasses['info-section'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['info-row'];
        __VLS_styleScopedClasses['info-row'];
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
                userData: userData,
                likeCount: likeCount,
                isLiked: isLiked,
                toggleLike: toggleLike,
                formatDate: formatDate,
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
