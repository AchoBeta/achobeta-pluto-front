/* __placeholder__ */
import { HomeFilled, UserFilled, } from '@element-plus/icons-vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const routers = [
    {
        path: '/login',
        name: '登录'
    }
];
// 独立的主页和团队信息项
const additionalItems = [
    {
        path: '/home',
        name: '主页',
        icon: HomeFilled
    },
    {
        path: '/team',
        name: '团队信息',
        icon: UserFilled
    }
];
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("container") }, });
    // @ts-ignore
    const __VLS_0 = {}
        .ElMenu;
    ({}.ElMenu);
    ({}.ElMenu);
    __VLS_components.ElMenu;
    __VLS_components.elMenu;
    __VLS_components.ElMenu;
    __VLS_components.elMenu;
    // @ts-ignore
    [ElMenu, ElMenu,];
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("menu") }, defaultActive: ("1"), }));
    const __VLS_2 = __VLS_1({ ...{ class: ("menu") }, defaultActive: ("1"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("menu") }, defaultActive: ("1"), }));
    const __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2));
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.additionalItems))) {
        // @ts-ignore
        const __VLS_6 = {}
            .RouterLink;
        ({}.RouterLink);
        ({}.RouterLink);
        __VLS_components.RouterLink;
        __VLS_components.routerLink;
        __VLS_components.RouterLink;
        __VLS_components.routerLink;
        // @ts-ignore
        [RouterLink, RouterLink,];
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ to: ((item.path)), }));
        const __VLS_8 = __VLS_7({ to: ((item.path)), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        ({}({ to: ((item.path)), }));
        const __VLS_11 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8));
        // @ts-ignore
        const __VLS_12 = {}
            .ElMenuItem;
        ({}.ElMenuItem);
        ({}.ElMenuItem);
        __VLS_components.ElMenuItem;
        __VLS_components.elMenuItem;
        __VLS_components.ElMenuItem;
        __VLS_components.elMenuItem;
        // @ts-ignore
        [ElMenuItem, ElMenuItem,];
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ index: ((item.path)), }));
        const __VLS_14 = __VLS_13({ index: ((item.path)), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({ index: ((item.path)), }));
        const __VLS_17 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14));
        if (item.icon) {
            // @ts-ignore
            const __VLS_18 = {}
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
            const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
            const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
            ({}({}));
            const __VLS_23 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20));
            const __VLS_24 = (item.icon);
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
            const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
            ({}({}));
            const __VLS_29 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26));
            // @ts-ignore
            [additionalItems,];
            __VLS_nonNullable(__VLS_23.slots).default;
        }
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.name);
        __VLS_nonNullable(__VLS_17.slots).default;
        __VLS_nonNullable(__VLS_11.slots).default;
    }
    __VLS_nonNullable(__VLS_5.slots).default;
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['container'];
        __VLS_styleScopedClasses['menu'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                additionalItems: additionalItems,
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
