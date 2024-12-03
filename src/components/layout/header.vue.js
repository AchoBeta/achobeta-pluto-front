/* __placeholder__ */
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { fetchNameApi, getDevicesApi, removeDeviceApi } from '@/axios/api/home';
import { exitSystem } from '@/components/layout/utils/Logout'; // 引入 exitSystem 函数
import dayjs from 'dayjs';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
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
        }
        else {
            ElMessage.warning(result.message); // 警告提示
            if (result.code === -20000 || result.code === -20002) {
                clearLocalStorage();
                router.replace('/login');
            }
        }
    }
    catch (error) {
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
    }
    catch (error) {
        // 处理获取设备数据时发生的错误
        ElMessage.error('成员信息获取失败。');
        console.error('Failed to update grid data:', error);
    }
};
const currentGridData = ref([]);
for (let i = 0; i < currentGridData.value.length; i++) {
    let time = currentGridData.value[i].online_time;
    currentGridData.value[i].online_time = dayjs(time).format('YYYY-MM-DD HH:mm:ss ');
}
const service_id = localStorage.getItem('service_id'); //当前设备
console.log('当前设备:', service_id);
//分页
const totalDevices = ref(10); // 假设总共有10台设备
const pageSize = 6; // 开发阶段为3，后期更改为每页显示5台设备 
const currentPage = ref(1); // 当前页码
//下线
const handleOffLine = async (id, index) => {
    try {
        console.log('下线设备-设备ID:', id);
        const response = await removeDeviceApi({ id });
        console.log('下线设备-后端响应内容:', response.data); // 打印后端响应内容
        if (response.data.code === 20000) {
            ElMessage.success('下线成功。');
            buttonStates.value[index] = true;
            // updateCurrentGridData();
        }
    }
    catch (error) {
        ElMessage.error('下线失败。');
        console.error('Error fetching devices:', error);
    }
};
// 更新当前页数据
const buttonStates = ref([]);
const handlePageChange = (page) => {
    buttonStates.value = [];
    currentPage.value = page;
    updateCurrentGridData();
};
const updateCurrentGridData = async () => {
    try {
        const response = await getDevicesApi({ page_number: currentPage.value, line_number: pageSize });
        console.log('更新常用设备列表-后端响应内容:', response.data); // 打印后端响应内容 
        currentGridData.value = response.data.data.devices;
        totalDevices.value = response.data.data.total;
        buttonStates.value = currentGridData.value.map(() => false);
        for (let i = 0; i < currentGridData.value.length; i++) {
            if (!currentGridData.value[i].device_name)
                currentGridData.value[i].device_name = `设备${6 * (currentPage.value - 1) + (i + 1)}`;
            let time = currentGridData.value[i].online_time;
            currentGridData.value[i].online_time = dayjs(time).format('YYYY-MM-DD HH:mm:ss ');
        }
    }
    catch (error) {
        ElMessage.error('成员信息获取失败。');
        console.error('Error fetching devices:', error);
    }
};
////挂载
onMounted(async () => {
    try {
        const data = await fetchNameApi();
        console.log('获取用户姓名-后端响应:', data.data);
        if (data.data.data)
            name.value = data.data.data.name;
        else
            ElMessage.error('名字获取失败。');
    }
    catch (error) {
        ElMessage.error('名字获取失败。');
        console.error('Error fetching name:', error);
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
    // @ts-ignore
    const __VLS_0 = {}
        .ElHeader;
    ({}.ElHeader);
    ({}.ElHeader);
    __VLS_components.ElHeader;
    __VLS_components.elHeader;
    __VLS_components.ElHeader;
    __VLS_components.elHeader;
    // @ts-ignore
    [ElHeader, ElHeader,];
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ class: ("header") }, }));
    const __VLS_2 = __VLS_1({ ...{ class: ("header") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ class: ("header") }, }));
    const __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2));
    // @ts-ignore
    const __VLS_6 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ modelValue: ((__VLS_ctx.deviceDialogVisible)), title: ("常用设备"), width: ("800"), ...{ style: ({}) }, }));
    const __VLS_8 = __VLS_7({ modelValue: ((__VLS_ctx.deviceDialogVisible)), title: ("常用设备"), width: ("800"), ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    ({}({ modelValue: ((__VLS_ctx.deviceDialogVisible)), title: ("常用设备"), width: ("800"), ...{ style: ({}) }, }));
    const __VLS_11 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    // @ts-ignore
    [deviceDialogVisible,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.hr, __VLS_intrinsicElements.hr)({});
    // @ts-ignore
    const __VLS_12 = {}
        .ElTable;
    ({}.ElTable);
    ({}.ElTable);
    __VLS_components.ElTable;
    __VLS_components.elTable;
    __VLS_components.ElTable;
    __VLS_components.elTable;
    // @ts-ignore
    [ElTable, ElTable,];
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({ data: ((__VLS_ctx.currentGridData)), }));
    const __VLS_14 = __VLS_13({ data: ((__VLS_ctx.currentGridData)), }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    ({}({ data: ((__VLS_ctx.currentGridData)), }));
    const __VLS_17 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14));
    // @ts-ignore
    const __VLS_18 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ property: ("device_name"), label: ("设备名称"), width: ("150"), }));
    const __VLS_20 = __VLS_19({ property: ("device_name"), label: ("设备名称"), width: ("150"), }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    ({}({ property: ("device_name"), label: ("设备名称"), width: ("150"), }));
    const __VLS_23 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20));
    // @ts-ignore
    [currentGridData,];
    // @ts-ignore
    const __VLS_24 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ property: ("ip"), label: ("上次登录IP"), width: ("200"), }));
    const __VLS_26 = __VLS_25({ property: ("ip"), label: ("上次登录IP"), width: ("200"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    ({}({ property: ("ip"), label: ("上次登录IP"), width: ("200"), }));
    const __VLS_29 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26));
    // @ts-ignore
    const __VLS_30 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ property: ("online_time"), label: ("上次登录时间"), }));
    const __VLS_32 = __VLS_31({ property: ("online_time"), label: ("上次登录时间"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    ({}({ property: ("online_time"), label: ("上次登录时间"), }));
    const __VLS_35 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32));
    // @ts-ignore
    const __VLS_36 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({ label: ("操作"), width: ("180"), }));
    const __VLS_38 = __VLS_37({ label: ("操作"), width: ("180"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    ({}({ label: ("操作"), width: ("180"), }));
    const __VLS_41 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { default: __VLS_thisSlot } = __VLS_nonNullable(__VLS_41.slots);
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        if (scope.row.id == __VLS_ctx.service_id) {
            // @ts-ignore
            const __VLS_42 = {}
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
            const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ type: ("text"), size: ("small"), disabled: ((true)), }));
            const __VLS_44 = __VLS_43({ type: ("text"), size: ("small"), disabled: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_43));
            ({}({ type: ("text"), size: ("small"), disabled: ((true)), }));
            const __VLS_47 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_42, __VLS_44));
            // @ts-ignore
            [service_id,];
            __VLS_nonNullable(__VLS_47.slots).default;
        }
        else if (!__VLS_ctx.buttonStates[scope.$index]) {
            // @ts-ignore
            const __VLS_48 = {}
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
            const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ ...{ 'onClick': {} }, type: ("text"), size: ("small"), }));
            const __VLS_50 = __VLS_49({ ...{ 'onClick': {} }, type: ("text"), size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            ({}({ ...{ 'onClick': {} }, type: ("text"), size: ("small"), }));
            let __VLS_54;
            const __VLS_55 = {
                onClick: (...[$event]) => {
                    if (!(!((scope.row.id == __VLS_ctx.service_id))))
                        return;
                    if (!((!__VLS_ctx.buttonStates[scope.$index])))
                        return;
                    __VLS_ctx.handleOffLine(scope.row.id, scope.$index);
                    // @ts-ignore
                    [buttonStates, handleOffLine,];
                }
            };
            const __VLS_53 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50));
            let __VLS_51;
            let __VLS_52;
            __VLS_nonNullable(__VLS_53.slots).default;
        }
        else {
            // @ts-ignore
            const __VLS_56 = {}
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
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ type: ("text"), size: ("small"), disabled: ((true)), }));
            const __VLS_58 = __VLS_57({ type: ("text"), size: ("small"), disabled: ((true)), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            ({}({ type: ("text"), size: ("small"), disabled: ((true)), }));
            const __VLS_61 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58));
            __VLS_nonNullable(__VLS_61.slots).default;
        }
        __VLS_nonNullable(__VLS_41.slots)['' /* empty slot name completion */];
    }
    __VLS_nonNullable(__VLS_17.slots).default;
    // @ts-ignore
    const __VLS_62 = {}
        .ElPagination;
    ({}.ElPagination);
    __VLS_components.ElPagination;
    __VLS_components.elPagination;
    // @ts-ignore
    [ElPagination,];
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalDevices)), pageSize: ((__VLS_ctx.pageSize)), }));
    const __VLS_64 = __VLS_63({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalDevices)), pageSize: ((__VLS_ctx.pageSize)), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    ({}({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalDevices)), pageSize: ((__VLS_ctx.pageSize)), }));
    let __VLS_68;
    const __VLS_69 = {
        onCurrentChange: (__VLS_ctx.handlePageChange)
    };
    const __VLS_67 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64));
    let __VLS_65;
    let __VLS_66;
    // @ts-ignore
    [totalDevices, pageSize, handlePageChange,];
    __VLS_nonNullable(__VLS_11.slots).default;
    // @ts-ignore
    const __VLS_70 = {}
        .ElDropdown;
    ({}.ElDropdown);
    ({}.ElDropdown);
    __VLS_components.ElDropdown;
    __VLS_components.elDropdown;
    __VLS_components.ElDropdown;
    __VLS_components.elDropdown;
    // @ts-ignore
    [ElDropdown, ElDropdown,];
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ ...{ class: ("header-right") }, trigger: ("hover"), placement: ("bottom-end"), }));
    const __VLS_72 = __VLS_71({ ...{ class: ("header-right") }, trigger: ("hover"), placement: ("bottom-end"), }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    ({}({ ...{ class: ("header-right") }, trigger: ("hover"), placement: ("bottom-end"), }));
    const __VLS_75 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72));
    if (__VLS_ctx.name) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("el-dropdown-link") }, ...{ style: ({}) }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.name);
        // @ts-ignore
        [name, name,];
        // @ts-ignore
        const __VLS_76 = {}
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
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
        const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
        ({}({}));
        const __VLS_81 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_76, __VLS_78));
        // @ts-ignore
        const __VLS_82 = {}
            .ArrowDown;
        ({}.ArrowDown);
        __VLS_components.ArrowDown;
        // @ts-ignore
        [ArrowDown,];
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({ ...{ style: ({}) }, }));
        const __VLS_84 = __VLS_83({ ...{ style: ({}) }, }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        ({}({ ...{ style: ({}) }, }));
        const __VLS_87 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84));
        __VLS_nonNullable(__VLS_81.slots).default;
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { dropdown: __VLS_thisSlot } = __VLS_nonNullable(__VLS_75.slots);
        // @ts-ignore
        const __VLS_88 = {}
            .ElDropdownMenu;
        ({}.ElDropdownMenu);
        ({}.ElDropdownMenu);
        __VLS_components.ElDropdownMenu;
        __VLS_components.elDropdownMenu;
        __VLS_components.ElDropdownMenu;
        __VLS_components.elDropdownMenu;
        // @ts-ignore
        [ElDropdownMenu, ElDropdownMenu,];
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
        const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
        ({}({}));
        const __VLS_93 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_88, __VLS_90));
        // @ts-ignore
        const __VLS_94 = {}
            .ElDropdownItem;
        ({}.ElDropdownItem);
        ({}.ElDropdownItem);
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        // @ts-ignore
        [ElDropdownItem, ElDropdownItem,];
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({ ...{ 'onClick': {} }, }));
        const __VLS_96 = __VLS_95({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_100;
        const __VLS_101 = {
            onClick: (__VLS_ctx.navigateToPersonalCenter)
        };
        const __VLS_99 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_94, __VLS_96));
        let __VLS_97;
        let __VLS_98;
        // @ts-ignore
        const __VLS_102 = {}
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
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({}));
        const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
        ({}({}));
        const __VLS_107 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104));
        // @ts-ignore
        const __VLS_108 = {}
            .User;
        ({}.User);
        __VLS_components.User;
        // @ts-ignore
        [User,];
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
        const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
        ({}({}));
        const __VLS_113 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110));
        // @ts-ignore
        [navigateToPersonalCenter,];
        __VLS_nonNullable(__VLS_107.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_nonNullable(__VLS_99.slots).default;
        // @ts-ignore
        const __VLS_114 = {}
            .ElDropdownItem;
        ({}.ElDropdownItem);
        ({}.ElDropdownItem);
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        // @ts-ignore
        [ElDropdownItem, ElDropdownItem,];
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ ...{ 'onClick': {} }, }));
        const __VLS_116 = __VLS_115({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_120;
        const __VLS_121 = {
            onClick: (__VLS_ctx.showDeviceDialog)
        };
        const __VLS_119 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116));
        let __VLS_117;
        let __VLS_118;
        // @ts-ignore
        const __VLS_122 = {}
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
        const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({}));
        const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
        ({}({}));
        const __VLS_127 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_122, __VLS_124));
        // @ts-ignore
        const __VLS_128 = {}
            .Monitor;
        ({}.Monitor);
        __VLS_components.Monitor;
        // @ts-ignore
        [Monitor,];
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
        const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
        ({}({}));
        const __VLS_133 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_128, __VLS_130));
        // @ts-ignore
        [showDeviceDialog,];
        __VLS_nonNullable(__VLS_127.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_nonNullable(__VLS_119.slots).default;
        // @ts-ignore
        const __VLS_134 = {}
            .ElDropdownItem;
        ({}.ElDropdownItem);
        ({}.ElDropdownItem);
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        __VLS_components.ElDropdownItem;
        __VLS_components.elDropdownItem;
        // @ts-ignore
        [ElDropdownItem, ElDropdownItem,];
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({ ...{ 'onClick': {} }, }));
        const __VLS_136 = __VLS_135({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        ({}({ ...{ 'onClick': {} }, }));
        let __VLS_140;
        const __VLS_141 = {
            onClick: (__VLS_ctx.handleLogout)
        };
        const __VLS_139 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_134, __VLS_136));
        let __VLS_137;
        let __VLS_138;
        // @ts-ignore
        const __VLS_142 = {}
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
        const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({}));
        const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
        ({}({}));
        const __VLS_147 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_142, __VLS_144));
        // @ts-ignore
        const __VLS_148 = {}
            .SwitchButton;
        ({}.SwitchButton);
        __VLS_components.SwitchButton;
        // @ts-ignore
        [SwitchButton,];
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
        const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
        ({}({}));
        const __VLS_153 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_148, __VLS_150));
        // @ts-ignore
        [handleLogout,];
        __VLS_nonNullable(__VLS_147.slots).default;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_nonNullable(__VLS_139.slots).default;
        __VLS_nonNullable(__VLS_93.slots).default;
    }
    __VLS_nonNullable(__VLS_5.slots).default;
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['header'];
        __VLS_styleScopedClasses['header-right'];
        __VLS_styleScopedClasses['el-dropdown-link'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                ArrowDown: ArrowDown,
                name: name,
                navigateToPersonalCenter: navigateToPersonalCenter,
                handleLogout: handleLogout,
                deviceDialogVisible: deviceDialogVisible,
                showDeviceDialog: showDeviceDialog,
                currentGridData: currentGridData,
                service_id: service_id,
                totalDevices: totalDevices,
                pageSize: pageSize,
                handleOffLine: handleOffLine,
                buttonStates: buttonStates,
                handlePageChange: handlePageChange,
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
