/* __placeholder__ */
import PointsBox from './components/PointsBox.vue';
import MessagesBox from './components/MessagesBox.vue';
import Progress from '@/views/home/components/ProgressBox.vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("homepage") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("top-row") }, });
    // @ts-ignore
    [PointsBox,];
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PointsBox, new PointsBox({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    ({}({}));
    const __VLS_4 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(PointsBox, __VLS_1));
    // @ts-ignore
    [MessagesBox,];
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(MessagesBox, new MessagesBox({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    ({}({}));
    const __VLS_9 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(MessagesBox, __VLS_6));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("progress-box") }, });
    // @ts-ignore
    [Progress,];
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(Progress, new Progress({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    ({}({}));
    const __VLS_14 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(Progress, __VLS_11));
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['homepage'];
        __VLS_styleScopedClasses['top-row'];
        __VLS_styleScopedClasses['progress-box'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                PointsBox: PointsBox,
                MessagesBox: MessagesBox,
                Progress: Progress,
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
