/* __placeholder__ */
import { ref, onMounted } from 'vue';
import { getPoints } from '../utils/getPoints';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
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
    const atoken = localStorage.getItem('atoken'); // 从 localStorage 获取 atoken
    if (!atoken) {
        console.error('用户未登录或 atoken 缺失');
        alert('请先登录后查看积分信息'); // 或者直接跳转到登录页,待修改
        // 跳转到登录页面
        return;
    }
    // const points = await getPoints(atoken);
    // if (points) {
    //   pointsData.value[0].value = points.monthly_points || '00';
    //   pointsData.value[1].value = points.monthly_ranking || '00';
    //   pointsData.value[2].value = points.current_points || '00';
    //   pointsData.value[3].value = points.total_points || '00';
    // }
});
const __VLS_fnComponent = (await import('vue')).defineComponent({});
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("box points-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({ ...{ class: ("box-title") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("points-details") }, });
    for (const [point, index] of __VLS_getVForSourceType((__VLS_ctx.pointsData))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("points-item") }, key: ((index)), ...{ class: ((point.backgroundClass)) }, });
        __VLS_styleScopedClasses = (point.backgroundClass);
        if (index === 0) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/icons/home-add.svg"), ...{ class: ("add-icon") }, alt: ("add icon"), });
            // @ts-ignore
            [pointsData,];
        }
        if (index === 2) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/icons/home-leave.svg"), ...{ class: ("left-icon") }, alt: ("leave icon"), });
        }
        if (index === 1) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/icons/home-rank.svg"), ...{ class: ("side-icon") }, alt: ("rank icon"), });
        }
        if (index === 3) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("@/assets/icons/home-accumulate.svg"), ...{ class: ("accumulate-icon") }, alt: ("accumulate icon"), });
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("text-content") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("item-title") }, });
        (point.title);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-content") }, });
        (point.value);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['box'];
        __VLS_styleScopedClasses['points-box'];
        __VLS_styleScopedClasses['box-title'];
        __VLS_styleScopedClasses['points-details'];
        __VLS_styleScopedClasses['points-item'];
        __VLS_styleScopedClasses['add-icon'];
        __VLS_styleScopedClasses['left-icon'];
        __VLS_styleScopedClasses['side-icon'];
        __VLS_styleScopedClasses['accumulate-icon'];
        __VLS_styleScopedClasses['text-content'];
        __VLS_styleScopedClasses['item-title'];
        __VLS_styleScopedClasses['item-content'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                pointsData: pointsData,
            };
        },
    });
}
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
