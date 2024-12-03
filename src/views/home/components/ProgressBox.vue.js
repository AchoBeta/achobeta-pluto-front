/* __placeholder__ */
import { getProgressApi } from '@/axios/api/home';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const total_task_count = ref('0');
const incomplete_task_count = ref('0');
const upcoming_overdue_task_count = ref('0');
const overdue_task_count = ref('0');
onMounted(async () => {
    try {
        const data = await getProgressApi({ 'force-update': false });
        console.log('后端响应:', data.data);
        if (data.data.data == null) {
            ElMessage.error('项目进度获取失败。');
        }
        else {
            total_task_count.value = data.data.data.total_task_count;
            incomplete_task_count.value = data.data.data.unfinished_task_count;
            upcoming_overdue_task_count.value = data.data.data.will_overdue_task_count;
            overdue_task_count.value = data.data.data.overdue_task_count;
        }
    }
    catch (error) {
        ElMessage.error('项目进度获取失败。');
        console.error('Error fetching progress:', error);
    }
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
    var __VLS_0 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("progress-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ style: ({}) }, });
    // @ts-ignore
    const __VLS_1 = {}
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
    const __VLS_2 = __VLS_asFunctionalComponent(__VLS_1, new __VLS_1({ ...{ class: ("calendar") }, size: ("24px"), }));
    const __VLS_3 = __VLS_2({ ...{ class: ("calendar") }, size: ("24px"), }, ...__VLS_functionalComponentArgsRest(__VLS_2));
    ({}({ ...{ class: ("calendar") }, size: ("24px"), }));
    const __VLS_6 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_1, __VLS_3));
    // @ts-ignore
    const __VLS_7 = {}
        .Calendar;
    ({}.Calendar);
    __VLS_components.Calendar;
    // @ts-ignore
    [Calendar,];
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    ({}({}));
    const __VLS_12 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_7, __VLS_9));
    __VLS_nonNullable(__VLS_6.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({ ...{ class: ("box-title") }, ...{ style: ({}) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-container") }, ...{ style: ({}) }, });
    // @ts-ignore
    const __VLS_13 = {}
        .ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ ...{ class: ("progress-card total") }, shadow: ("hover"), }));
    const __VLS_15 = __VLS_14({ ...{ class: ("progress-card total") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    ({}({ ...{ class: ("progress-card total") }, shadow: ("hover"), }));
    const __VLS_18 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_13, __VLS_15));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { header: __VLS_thisSlot } = __VLS_nonNullable(__VLS_18.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-title") }, });
        // @ts-ignore
        const __VLS_19 = {}
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
        const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
        const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
        ({}({}));
        const __VLS_24 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_19, __VLS_21));
        // @ts-ignore
        const __VLS_25 = {}
            .List;
        ({}.List);
        __VLS_components.List;
        // @ts-ignore
        [List,];
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
        const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
        ({}({}));
        const __VLS_30 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27));
        __VLS_nonNullable(__VLS_24.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-content") }, });
    (__VLS_ctx.total_task_count);
    // @ts-ignore
    [total_task_count,];
    // @ts-ignore
    const __VLS_31 = {}
        .ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ ...{ class: ("progress-card unfinish") }, shadow: ("hover"), }));
    const __VLS_33 = __VLS_32({ ...{ class: ("progress-card unfinish") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    ({}({ ...{ class: ("progress-card unfinish") }, shadow: ("hover"), }));
    const __VLS_36 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_31, __VLS_33));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { header: __VLS_thisSlot } = __VLS_nonNullable(__VLS_36.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-title") }, });
        // @ts-ignore
        const __VLS_37 = {}
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
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
        ({}({}));
        const __VLS_42 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_37, __VLS_39));
        // @ts-ignore
        const __VLS_43 = {}
            .PieChart;
        ({}.PieChart);
        __VLS_components.PieChart;
        // @ts-ignore
        [PieChart,];
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
        const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
        ({}({}));
        const __VLS_48 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_43, __VLS_45));
        __VLS_nonNullable(__VLS_42.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-content") }, });
    (__VLS_ctx.incomplete_task_count);
    // @ts-ignore
    [incomplete_task_count,];
    // @ts-ignore
    const __VLS_49 = {}
        .ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({ ...{ class: ("progress-card ddl") }, shadow: ("hover"), }));
    const __VLS_51 = __VLS_50({ ...{ class: ("progress-card ddl") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    ({}({ ...{ class: ("progress-card ddl") }, shadow: ("hover"), }));
    const __VLS_54 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_49, __VLS_51));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { header: __VLS_thisSlot } = __VLS_nonNullable(__VLS_54.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-title") }, });
        // @ts-ignore
        const __VLS_55 = {}
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
        const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({}));
        const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
        ({}({}));
        const __VLS_60 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_55, __VLS_57));
        // @ts-ignore
        const __VLS_61 = {}
            .Warning;
        ({}.Warning);
        __VLS_components.Warning;
        // @ts-ignore
        [Warning,];
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({}));
        const __VLS_63 = __VLS_62({}, ...__VLS_functionalComponentArgsRest(__VLS_62));
        ({}({}));
        const __VLS_66 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63));
        __VLS_nonNullable(__VLS_60.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-content") }, });
    (__VLS_ctx.upcoming_overdue_task_count);
    // @ts-ignore
    [upcoming_overdue_task_count,];
    // @ts-ignore
    const __VLS_67 = {}
        .ElCard;
    ({}.ElCard);
    ({}.ElCard);
    __VLS_components.ElCard;
    __VLS_components.elCard;
    __VLS_components.ElCard;
    __VLS_components.elCard;
    // @ts-ignore
    [ElCard, ElCard,];
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ ...{ class: ("progress-card fault") }, shadow: ("hover"), }));
    const __VLS_69 = __VLS_68({ ...{ class: ("progress-card fault") }, shadow: ("hover"), }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    ({}({ ...{ class: ("progress-card fault") }, shadow: ("hover"), }));
    const __VLS_72 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_67, __VLS_69));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { header: __VLS_thisSlot } = __VLS_nonNullable(__VLS_72.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-title") }, });
        // @ts-ignore
        const __VLS_73 = {}
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
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
        const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
        ({}({}));
        const __VLS_78 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_73, __VLS_75));
        // @ts-ignore
        const __VLS_79 = {}
            .CircleClose;
        ({}.CircleClose);
        __VLS_components.CircleClose;
        // @ts-ignore
        [CircleClose,];
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({}));
        const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
        ({}({}));
        const __VLS_84 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_79, __VLS_81));
        __VLS_nonNullable(__VLS_78.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("item-content") }, });
    (__VLS_ctx.overdue_task_count);
    // @ts-ignore
    [overdue_task_count,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['progress-box'];
        __VLS_styleScopedClasses['calendar'];
        __VLS_styleScopedClasses['box-title'];
        __VLS_styleScopedClasses['card-container'];
        __VLS_styleScopedClasses['progress-card'];
        __VLS_styleScopedClasses['total'];
        __VLS_styleScopedClasses['item-title'];
        __VLS_styleScopedClasses['item-content'];
        __VLS_styleScopedClasses['progress-card'];
        __VLS_styleScopedClasses['unfinish'];
        __VLS_styleScopedClasses['item-title'];
        __VLS_styleScopedClasses['item-content'];
        __VLS_styleScopedClasses['progress-card'];
        __VLS_styleScopedClasses['ddl'];
        __VLS_styleScopedClasses['item-title'];
        __VLS_styleScopedClasses['item-content'];
        __VLS_styleScopedClasses['progress-card'];
        __VLS_styleScopedClasses['fault'];
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
                total_task_count: total_task_count,
                incomplete_task_count: incomplete_task_count,
                upcoming_overdue_task_count: upcoming_overdue_task_count,
                overdue_task_count: overdue_task_count,
            };
        },
    });
}
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default {};
;
