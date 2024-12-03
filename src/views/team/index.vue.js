/* __placeholder__ */
import { getPowerApi, deleteTeamMemberApi, CreateTeamApi, getTeamMemberListApi, getTeamStructureApi, putTeamNodeApi } from '@/axios/api/teamInformation.ts';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'vue-router';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
// 跳转到新增用户页面
const handleAddUser = (selectedTeamId, selectedTeamName) => {
    router.push({
        path: `/team/new-user/${selectedTeamId}/${selectedTeamName}`,
    }); // 跳转到新增用户页面的路由 
};
const handleViewDetail = (id) => {
    // 根据 level 决定跳转的页面
    const targetPath = level.value === 1
        ? '/team/detail-com' // 如果 level 为 1，则跳转到 DetailViewCom 页面
        : '/team/detail-super'; // 如果 level 为 2 或 3，则跳转到 DetailViewSurper 页面
    router.push({
        path: `${targetPath}/${id}`, // 使用动态路径
        query: {
            teamId: selectedTeamId.value,
            teamName: selectedTeamName.value,
            level: level.value,
            id: id
        }
    });
    console.log('跳转路径:', `${targetPath}/${id}`, '查询参数:', {
        teamId: selectedTeamId.value,
        teamName: selectedTeamName.value,
        level: level.value,
    });
};
let currentData = ref([]);
const pageSize = 5; // 每页显示的数据条数
let currentPage = ref(1); //当前页面
let totalPages = ref(1); //总数据条数
const handlePageChange = (page) => {
    currentPage.value = page;
    updateCurrentData();
};
const updateCurrentData = async () => {
    try {
        const response = await getTeamMemberListApi({ team_id: selectedTeamId.value, page: currentPage.value, perpage: pageSize });
        console.log('传入的team_id为:', selectedTeamId.value);
        console.log('更新团队成员列表-后端响应内容:', response.data);
        currentData.value = response.data.data.members;
        console.log('长度', response.data.data.total);
        if (currentData.value)
            totalPages.value = response.data.data.total;
        else
            totalPages.value = 0;
    }
    catch (error) {
        ElMessage.error('成员信息获取失败。');
        console.error('Error fetching teamMembers:', error);
    }
};
//下拉框
const selectedTeamId = ref(0);
const selectedTeamName = ref('');
let dropdownItems = ref([]);
let teamName = ref('');
let showAddTeam = ref(true);
let hoverItem = ref(null);
//团队信息
let first_teamid = ref(1);
let first_team_name = ref('AchoBeta 1.0');
const selectTeam = (item) => {
    if (!item.isDisabled) {
        selectedTeamId.value = item.id;
        selectedTeamName.value = item.name;
        currentPage.value = 1;
        handleTeamManage();
        // 禁用已选择的团队
        dropdownItems.value = dropdownItems.value.map(i => i.id === item.id ? { ...i, isDisabled: true } : { ...i, isDisabled: false });
        // 隐藏输入框，显示下拉菜单项
        showAddTeam.value = true;
        currentPage.value = 1;
        showLevel2.value = false;
        showLevel3.value = false;
        showLevel4.value = false;
    }
};
const selectTeamMember = (item) => {
    if (!item.isDisabled) {
        selectedTeamId.value = item.id;
        selectedTeamName.value = item.name;
        currentPage.value = 1;
        updateCurrentData();
        // 禁用已选择的团队
        dropdownItems.value = dropdownItems.value.map(i => i.id === item.id ? { ...i, isDisabled: true } : { ...i, isDisabled: false });
        // 隐藏输入框，显示下拉菜单项
        showAddTeam.value = true;
        currentPage.value = 1;
    }
};
const toggleAddTeam = () => {
    showAddTeam.value = !showAddTeam.value;
};
const addTeam = async () => {
    try {
        if (teamName.value) {
            console.log("teamName:", teamName.value);
            const team_name = teamName.value;
            const response = await CreateTeamApi(team_name);
            console.log("新增团队-后端响应为：", response.data);
            if (response.data.code === 20000) {
                ElMessage({
                    type: 'success',
                    message: '已成功新增',
                });
                getRight();
                toggleAddTeam(); // 隐藏输入框，显示下拉菜单项
                teamName.value = ''; // 清空输入框
            }
            else {
                ElMessage.error('团队新增失败。');
            }
        }
        showAddTeam.value = true;
    }
    catch (error) {
        ElMessage.error('团队新增失败。');
        console.error('Error adding new team:', error);
    }
};
//删除
const ifDelete = ref(false);
function showDelete(id) {
    ElMessageBox.confirm('是否确认删除此团队成员？', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    }).then(() => {
        //调用接口
        handleDelete(id);
        console.log(ifDelete.value);
        ElMessage({
            type: 'success',
            message: '已成功删除',
        });
    });
}
const handleDelete = async (id) => {
    const teamId = selectedTeamId.value;
    console.log("memberid:", id, "teamId:", teamId, "teamName:", selectedTeamName.value);
    try {
        const response = await deleteTeamMemberApi(teamId, id);
        console.log("删除-后端响应为：", response.data);
        ifDelete.value = true;
        updateCurrentData();
    }
    catch (error) {
        ElMessage.error('删除失败。');
        console.error('Error deleting teamMember:', error);
    }
};
//团队架构查看和管理跳转
const teamManageOptionShow = ref(false); //团队架构管理
const team_structures = ref([]);
const OldTeam_structures = ref([]); //旧团队架构管理
const handleTeamManage = async () => {
    try {
        teamManageOptionShow.value = true;
        const response = await getTeamStructureApi({ team_id: selectedTeamId.value });
        console.log("团队架构-后端响应为：", response.data);
        if (response.data.code === -20000)
            ElMessage.error('登录已过期，请重新登陆！');
        else {
            root_id.value = response.data.data.root_of_team;
            team_structures.value = response.data.data.team_structures;
            OldTeam_structures.value = response.data.data.team_structures.slice();
        }
    }
    catch (error) {
        ElMessage.error('团队架构获取失败。');
        console.error('Error fetching teamStructures:', error);
    }
};
//权限组
let urls = ref([]);
const level = ref(1);
let addNewTeam = ref(false);
let TeamStrManage = ref(false);
let deleteMember = ref(false);
let addMember = ref(false);
//团队架构
const root_id = ref(0);
const showLevel2 = ref(false); //展示目录面
const showLevel3 = ref(false);
const showLevel4 = ref(false);
const level1 = ref(root_id); //筛选对应级目录
const level2 = ref(null);
const level3 = ref(null);
const level4 = ref(null);
const showInput1 = ref(false); //展示输入框
const showInput2 = ref(false);
const showInput3 = ref(false);
const showInput4 = ref(false);
function show2Node(node) {
    showLevel2.value = true;
    showLevel3.value = false;
    showLevel4.value = false;
    level2.value = node.myself_id;
    level3.value = null;
    level4.value = null;
}
function show3Node(node) {
    showLevel2.value = true;
    showLevel3.value = true;
    showLevel4.value = false;
    level3.value = node.myself_id;
    level4.value = null;
}
function show4Node(node) {
    showLevel2.value = true;
    showLevel3.value = true;
    showLevel4.value = faTruckMedical;
    level4.value = node.myself_id;
}
function handleNodeAdd(input) {
    switch (input) {
        case 'input1':
            showInput1.value = !showInput1.value;
            break;
        case 'input2':
            showInput2.value = !showInput2.value;
            break;
        case 'input3':
            showInput3.value = !showInput3.value;
            break;
        case 'input4':
            showInput4.value = !showInput4.value;
            break;
    }
    //showInput.value = !showInput.value;
}
const inputNodeName = ref('');
const addTeamNode = ref([]);
const deleteTeamNode = ref([]);
function inputNode(level, input) {
    if (inputNodeName.value) {
        const teamId = team_structures.value.find(node => node.myself_id === level)?.team_id;
        const newTeam1 = {
            team_id: teamId,
            myself_id: Date.now(),
            father_id: level,
            node_name: inputNodeName.value,
            is_deleted: 0
        };
        const newTeam2 = {
            team_id: teamId,
            father_id: level,
            node_name: inputNodeName.value,
            is_deleted: 0
        };
        team_structures.value.push(newTeam1);
        addTeamNode.value.push(newTeam2);
        handleNodeAdd(input);
        inputNodeName.value = '';
    }
}
function showNodeDelete(node, input) {
    ElMessageBox.confirm(//弹窗
    '是否确认删除此分组/职位？', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    }).then(() => {
        const newTeam = {
            team_id: node.team_id,
            myself_id: node.myself_id,
            father_id: node.father_id,
            node_name: node.node_name,
            is_deleted: 1
        };
        deleteTeamNode.value.push(newTeam);
        node.is_deleted = 1;
        updateFatherIds(node);
        const brotherNumber = team_structures.value.filter(item => item.father_id === node.father_id && item.is_deleted === 0).length;
        const children = team_structures.value.filter(item => item.father_id === node.myself_id && item.is_deleted === 0).length;
        if (brotherNumber === 0 && children === 0)
            switch (input) {
                case 'input1':
                    showLevel2.value = false;
                    showLevel3.value = false;
                    showLevel4.value = false;
                    break;
                case 'input2':
                    show2Node(node);
                    break;
                case 'input3':
                    show3Node(node);
                    break;
                case 'input4':
                    show4Node(node);
                    break;
            }
        ElMessage({
            type: 'success',
            message: '已成功删除',
        });
    });
}
function updateFatherIds(node) {
    team_structures.value.forEach(team => {
        if (team.father_id === node.myself_id) {
            team.father_id = node.father_id;
        }
    });
}
function resetTeam() {
    ElMessageBox.confirm(//弹窗
    '是否确认重置此团队架构？', '提示', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    }).then(() => {
        team_structures.value = OldTeam_structures.value;
        ElMessage({
            type: 'success',
            message: '已成功重置',
        });
    });
}
const saveTeam = async () => {
    try {
        console.log('新增结点:', addTeamNode.value);
        console.log('删除结点:', deleteTeamNode.value);
        const response1 = await putTeamNodeApi({ team_id: selectedTeamId.value, team_structures: addTeamNode.value });
        console.log("保存结点-后端响应为：", response1.data);
        const response2 = await putTeamNodeApi({ team_id: selectedTeamId.value, team_structures: deleteTeamNode.value });
        console.log("删除结点-后端响应为：", response2.data);
        if (response1.data.code === 20000 && response2.data.code === 20000) {
            ElMessage({
                type: 'success',
                message: '已成功保存',
            });
            addTeamNode.value = [];
            deleteTeamNode.value = [];
        }
        else
            ElMessage.error('团队架构保存失败。');
    }
    catch (error) {
        ElMessage.error('团队架构保存失败。');
        console.error('Failed to update grid data:', error);
    }
};
const getRight = async () => {
    try {
        const data = await getPowerApi({ team_id: first_teamid.value }); //获取权限组和团队列表
        console.log('获取权限组和团队列表-后端响应:', data.data);
        urls.value = data.data.data.urls;
        dropdownItems.value = data.data.data.teams;
        level.value = data.data.data.level;
        if (urls.value) {
            addNewTeam = computed(() => urls.value.includes("/api/team/structure/create")); //新增团队
            TeamStrManage = computed(() => urls.value.includes("/api/team/structure/collection")); //团队架构管理
            deleteMember = computed(() => urls.value.includes("/api/team/memberlist/delete")); //删除团队成员
            addMember = computed(() => urls.value.includes("/api/team/memberlist/create")); //新增团队成员
        }
        updateCurrentData();
    }
    catch (error) {
        ElMessage.error('成员列表数据获取失败。');
        console.error('Error fetching data:', error);
    }
    ;
};
const getFirstTeam = async () => {
    try {
        console.log('rtoken:', localStorage.getItem('rtoken'));
        console.log('atoken:', localStorage.getItem('atoken'));
        const data = await getPowerApi({ team_id: 0 }); //获取第一个团队id
        console.log('获取第一个团队id-后端响应:', data.data);
        if (data.data.code === -20000)
            ElMessage.error('登录已过期，请重新登陆！');
        else {
            first_teamid.value = data.data.data.first_teamid;
            first_team_name.value = data.data.data.first_team_name;
            selectedTeamId.value = first_teamid.value;
            selectedTeamName.value = first_team_name.value; //优先显示用户第一个团队的信息
        }
    }
    catch (error) {
        ElMessage.error('数据获取失败。');
        console.error('Error fetching data:', error);
    }
    ;
};
onMounted(async () => {
    try {
        console.log('rtoken:', localStorage.getItem('rtoken'));
        console.log('atoken:', localStorage.getItem('atoken'));
        const data = await getPowerApi({ team_id: 0 }); //获取第一个团队id
        console.log('获取第一个团队id-后端响应:', data.data);
        if (data.data.code === -20000)
            ElMessage.error('登录已过期，请重新登陆！');
        else {
            first_teamid.value = data.data.data.first_teamid;
            first_team_name.value = data.data.data.first_team_name;
            selectedTeamId.value = first_teamid.value;
            selectedTeamName.value = first_team_name.value; //优先显示用户第一个团队的信息
        }
    }
    catch (error) {
        ElMessage.error('数据获取失败。');
        console.error('Error fetching data:', error);
    }
    ;
    getRight();
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ modelValue: ((__VLS_ctx.teamManageOptionShow)), width: ("800"), ...{ style: ({}) }, center: (true), }));
    const __VLS_2 = __VLS_1({ modelValue: ((__VLS_ctx.teamManageOptionShow)), width: ("800"), ...{ style: ({}) }, center: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ modelValue: ((__VLS_ctx.teamManageOptionShow)), width: ("800"), ...{ style: ({}) }, center: (true), }));
    const __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { title: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("custom-title") }, });
        // @ts-ignore
        const __VLS_6 = {}
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
        const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({}));
        const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
        ({}({}));
        const __VLS_11 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8));
        // @ts-ignore
        const __VLS_12 = {}
            .Tools;
        ({}.Tools);
        __VLS_components.Tools;
        // @ts-ignore
        [Tools,];
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
        const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
        ({}({}));
        const __VLS_17 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14));
        // @ts-ignore
        [teamManageOptionShow,];
        __VLS_nonNullable(__VLS_11.slots).default;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.hr, __VLS_intrinsicElements.hr)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("teamTitle") }, ...{ style: ({}) }, });
    // @ts-ignore
    const __VLS_18 = {}
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
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({ ...{ 'onCommand': {} }, ...{ class: ("teamDownMenu") }, }));
    const __VLS_20 = __VLS_19({ ...{ 'onCommand': {} }, ...{ class: ("teamDownMenu") }, }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    ({}({ ...{ 'onCommand': {} }, ...{ class: ("teamDownMenu") }, }));
    let __VLS_24;
    const __VLS_25 = {
        onCommand: (__VLS_ctx.handleCommand)
    };
    const __VLS_23 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_18, __VLS_20));
    let __VLS_21;
    let __VLS_22;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("el-dropdown-link") }, });
    (__VLS_ctx.selectedTeamName);
    // @ts-ignore
    const __VLS_26 = {}
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
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ class: ("el-icon--right") }, }));
    const __VLS_28 = __VLS_27({ ...{ class: ("el-icon--right") }, }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    ({}({ ...{ class: ("el-icon--right") }, }));
    const __VLS_31 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28));
    // @ts-ignore
    const __VLS_32 = {}
        .CaretBottom;
    ({}.CaretBottom);
    __VLS_components.CaretBottom;
    // @ts-ignore
    [CaretBottom,];
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    ({}({}));
    const __VLS_37 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34));
    // @ts-ignore
    [handleCommand, selectedTeamName,];
    __VLS_nonNullable(__VLS_31.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { dropdown: __VLS_thisSlot } = __VLS_nonNullable(__VLS_23.slots);
        // @ts-ignore
        const __VLS_38 = {}
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
        const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        ({}({}));
        const __VLS_43 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40));
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.dropdownItems))) {
            // @ts-ignore
            const __VLS_44 = {}
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
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }));
            const __VLS_46 = __VLS_45({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            ({}({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }));
            __VLS_styleScopedClasses = ({ 'is-disabled': item.id === selectedTeamId });
            let __VLS_50;
            const __VLS_51 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.selectTeam(item);
                    // @ts-ignore
                    [dropdownItems, selectedTeamId, selectTeam,];
                }
            };
            const __VLS_52 = {
                onMouseenter: (...[$event]) => {
                    __VLS_ctx.hoverItem = item;
                    // @ts-ignore
                    [hoverItem,];
                }
            };
            const __VLS_53 = {
                onMouseleave: (...[$event]) => {
                    __VLS_ctx.hoverItem = null;
                    // @ts-ignore
                    [hoverItem,];
                }
            };
            const __VLS_49 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46));
            let __VLS_47;
            let __VLS_48;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.name);
            __VLS_nonNullable(__VLS_49.slots).default;
        }
        if (__VLS_ctx.addNewTeam) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            if (__VLS_ctx.showAddTeam) {
                // @ts-ignore
                const __VLS_54 = {}
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
                const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ ...{ 'onClick': {} }, }));
                const __VLS_56 = __VLS_55({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_55));
                ({}({ ...{ 'onClick': {} }, }));
                let __VLS_60;
                const __VLS_61 = {
                    onClick: (__VLS_ctx.toggleAddTeam)
                };
                const __VLS_59 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56));
                let __VLS_57;
                let __VLS_58;
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                // @ts-ignore
                [addNewTeam, showAddTeam, toggleAddTeam,];
                __VLS_nonNullable(__VLS_59.slots).default;
            }
            else {
                // @ts-ignore
                const __VLS_62 = {}
                    .ElInput;
                ({}.ElInput);
                __VLS_components.ElInput;
                __VLS_components.elInput;
                // @ts-ignore
                [ElInput,];
                // @ts-ignore
                const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }));
                const __VLS_64 = __VLS_63({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }, ...__VLS_functionalComponentArgsRest(__VLS_63));
                ({}({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }));
                let __VLS_68;
                const __VLS_69 = {
                    onKeyup: (__VLS_ctx.addTeam)
                };
                const __VLS_67 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_62, __VLS_64));
                let __VLS_65;
                let __VLS_66;
                // @ts-ignore
                [teamName, addTeam,];
            }
        }
        __VLS_nonNullable(__VLS_43.slots).default;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("bigBox") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("smallBox first") }, });
    for (const [node] of __VLS_getVForSourceType((__VLS_ctx.team_structures))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((node.myself_id)), });
        if (node.father_id == __VLS_ctx.level1 && __VLS_ctx.level1 != null && !node.is_deleted) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("nodeBox") }, });
            // @ts-ignore
            const __VLS_70 = {}
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
            const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
            const __VLS_72 = __VLS_71({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }, ...__VLS_functionalComponentArgsRest(__VLS_71));
            ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
            let __VLS_76;
            const __VLS_77 = {
                onClick: (...[$event]) => {
                    if (!((node.father_id == __VLS_ctx.level1 && __VLS_ctx.level1 != null && !node.is_deleted)))
                        return;
                    __VLS_ctx.show2Node(node);
                    // @ts-ignore
                    [team_structures, level1, level1, show2Node,];
                }
            };
            const __VLS_75 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72));
            let __VLS_73;
            let __VLS_74;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (node.node_name);
            __VLS_nonNullable(__VLS_75.slots).default;
            // @ts-ignore
            const __VLS_78 = {}
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
            const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
            const __VLS_80 = __VLS_79({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }, ...__VLS_functionalComponentArgsRest(__VLS_79));
            ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
            let __VLS_84;
            const __VLS_85 = {
                onClick: (...[$event]) => {
                    if (!((node.father_id == __VLS_ctx.level1 && __VLS_ctx.level1 != null && !node.is_deleted)))
                        return;
                    __VLS_ctx.showNodeDelete(node, 'input1');
                    // @ts-ignore
                    [showNodeDelete,];
                }
            };
            const __VLS_83 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80));
            let __VLS_81;
            let __VLS_82;
            // @ts-ignore
            const __VLS_86 = {}
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
            const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
            const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
            ({}({}));
            const __VLS_91 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_86, __VLS_88));
            // @ts-ignore
            const __VLS_92 = {}
                .Delete;
            ({}.Delete);
            __VLS_components.Delete;
            // @ts-ignore
            [Delete,];
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
            const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
            ({}({}));
            const __VLS_97 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_92, __VLS_94));
            __VLS_nonNullable(__VLS_91.slots).default;
            __VLS_nonNullable(__VLS_83.slots).default;
        }
    }
    if (__VLS_ctx.showInput1) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("inputBox") }, });
        // @ts-ignore
        const __VLS_98 = {}
            .ElInput;
        ({}.ElInput);
        __VLS_components.ElInput;
        __VLS_components.elInput;
        // @ts-ignore
        [ElInput,];
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
        const __VLS_100 = __VLS_99({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        ({}({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
        let __VLS_104;
        const __VLS_105 = {
            onKeyup: (...[$event]) => {
                if (!((__VLS_ctx.showInput1)))
                    return;
                __VLS_ctx.inputNode(__VLS_ctx.level1, 'input1');
                // @ts-ignore
                [level1, showInput1, inputNodeName, inputNode,];
            }
        };
        const __VLS_106 = {
            onBlur: (...[$event]) => {
                if (!((__VLS_ctx.showInput1)))
                    return;
                __VLS_ctx.handleNodeAdd('input1');
                // @ts-ignore
                [handleNodeAdd,];
            }
        };
        const __VLS_103 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_98, __VLS_100));
        let __VLS_101;
        let __VLS_102;
    }
    else {
        // @ts-ignore
        const __VLS_107 = {}
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
        const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
        const __VLS_109 = __VLS_108({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
        let __VLS_113;
        const __VLS_114 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.showInput1))))
                    return;
                __VLS_ctx.handleNodeAdd('input1');
                // @ts-ignore
                [handleNodeAdd,];
            }
        };
        const __VLS_112 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_107, __VLS_109));
        let __VLS_110;
        let __VLS_111;
        // @ts-ignore
        const __VLS_115 = {}
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
        const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({ ...{ class: ("nodeAddIcon") }, }));
        const __VLS_117 = __VLS_116({ ...{ class: ("nodeAddIcon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        ({}({ ...{ class: ("nodeAddIcon") }, }));
        const __VLS_120 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_115, __VLS_117));
        // @ts-ignore
        const __VLS_121 = {}
            .Plus;
        ({}.Plus);
        __VLS_components.Plus;
        // @ts-ignore
        [Plus,];
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({}));
        const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
        ({}({}));
        const __VLS_126 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_121, __VLS_123));
        __VLS_nonNullable(__VLS_120.slots).default;
        __VLS_nonNullable(__VLS_112.slots).default;
    }
    if (__VLS_ctx.showLevel2) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("smallBox second") }, });
        for (const [node] of __VLS_getVForSourceType((__VLS_ctx.team_structures))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((node.myself_id)), });
            if (node.father_id == __VLS_ctx.level2 && __VLS_ctx.level2 != null && !node.is_deleted) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("nodeBox") }, });
                // @ts-ignore
                const __VLS_127 = {}
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
                const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
                const __VLS_129 = __VLS_128({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }, ...__VLS_functionalComponentArgsRest(__VLS_128));
                ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
                let __VLS_133;
                const __VLS_134 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel2)))
                            return;
                        if (!((node.father_id == __VLS_ctx.level2 && __VLS_ctx.level2 != null && !node.is_deleted)))
                            return;
                        __VLS_ctx.show3Node(node);
                        // @ts-ignore
                        [team_structures, showLevel2, level2, level2, show3Node,];
                    }
                };
                const __VLS_132 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_127, __VLS_129));
                let __VLS_130;
                let __VLS_131;
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (node.node_name);
                __VLS_nonNullable(__VLS_132.slots).default;
                // @ts-ignore
                const __VLS_135 = {}
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
                const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                const __VLS_137 = __VLS_136({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }, ...__VLS_functionalComponentArgsRest(__VLS_136));
                ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                let __VLS_141;
                const __VLS_142 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel2)))
                            return;
                        if (!((node.father_id == __VLS_ctx.level2 && __VLS_ctx.level2 != null && !node.is_deleted)))
                            return;
                        __VLS_ctx.showNodeDelete(node, 'input2');
                        // @ts-ignore
                        [showNodeDelete,];
                    }
                };
                const __VLS_140 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_135, __VLS_137));
                let __VLS_138;
                let __VLS_139;
                // @ts-ignore
                const __VLS_143 = {}
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
                const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({}));
                const __VLS_145 = __VLS_144({}, ...__VLS_functionalComponentArgsRest(__VLS_144));
                ({}({}));
                const __VLS_148 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_143, __VLS_145));
                // @ts-ignore
                const __VLS_149 = {}
                    .Delete;
                ({}.Delete);
                __VLS_components.Delete;
                // @ts-ignore
                [Delete,];
                // @ts-ignore
                const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
                const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
                ({}({}));
                const __VLS_154 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_149, __VLS_151));
                __VLS_nonNullable(__VLS_148.slots).default;
                __VLS_nonNullable(__VLS_140.slots).default;
            }
        }
        if (__VLS_ctx.showInput2) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("inputBox") }, });
            // @ts-ignore
            const __VLS_155 = {}
                .ElInput;
            ({}.ElInput);
            __VLS_components.ElInput;
            __VLS_components.elInput;
            // @ts-ignore
            [ElInput,];
            // @ts-ignore
            const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            const __VLS_157 = __VLS_156({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }, ...__VLS_functionalComponentArgsRest(__VLS_156));
            ({}({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            let __VLS_161;
            const __VLS_162 = {
                onKeyup: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel2)))
                        return;
                    if (!((__VLS_ctx.showInput2)))
                        return;
                    __VLS_ctx.inputNode(__VLS_ctx.level2, 'input2');
                    // @ts-ignore
                    [inputNodeName, inputNode, level2, showInput2,];
                }
            };
            const __VLS_163 = {
                onBlur: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel2)))
                        return;
                    if (!((__VLS_ctx.showInput2)))
                        return;
                    __VLS_ctx.handleNodeAdd('input2');
                    // @ts-ignore
                    [handleNodeAdd,];
                }
            };
            const __VLS_160 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_155, __VLS_157));
            let __VLS_158;
            let __VLS_159;
        }
        else if (__VLS_ctx.level2 || (!__VLS_ctx.level2 && __VLS_ctx.level1)) {
            // @ts-ignore
            const __VLS_164 = {}
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
            const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            const __VLS_166 = __VLS_165({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }, ...__VLS_functionalComponentArgsRest(__VLS_165));
            ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            let __VLS_170;
            const __VLS_171 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel2)))
                        return;
                    if (!(!((__VLS_ctx.showInput2))))
                        return;
                    if (!((__VLS_ctx.level2 || (!__VLS_ctx.level2 && __VLS_ctx.level1))))
                        return;
                    __VLS_ctx.handleNodeAdd('input2');
                    // @ts-ignore
                    [level1, handleNodeAdd, level2, level2,];
                }
            };
            const __VLS_169 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_164, __VLS_166));
            let __VLS_167;
            let __VLS_168;
            // @ts-ignore
            const __VLS_172 = {}
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
            const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_174 = __VLS_173({ ...{ class: ("nodeAddIcon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_173));
            ({}({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_177 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_172, __VLS_174));
            // @ts-ignore
            const __VLS_178 = {}
                .Plus;
            ({}.Plus);
            __VLS_components.Plus;
            // @ts-ignore
            [Plus,];
            // @ts-ignore
            const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({}));
            const __VLS_180 = __VLS_179({}, ...__VLS_functionalComponentArgsRest(__VLS_179));
            ({}({}));
            const __VLS_183 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_178, __VLS_180));
            __VLS_nonNullable(__VLS_177.slots).default;
            __VLS_nonNullable(__VLS_169.slots).default;
        }
    }
    if (__VLS_ctx.showLevel3) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("smallBox third") }, });
        for (const [node] of __VLS_getVForSourceType((__VLS_ctx.team_structures))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel3)))
                            return;
                        __VLS_ctx.show4Node(node);
                        // @ts-ignore
                        [team_structures, showLevel3, show4Node,];
                    } }, key: ((node.myself_id)), });
            if (node.father_id == __VLS_ctx.level3 && __VLS_ctx.level3 != null && !node.is_deleted) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("nodeBox") }, });
                // @ts-ignore
                const __VLS_184 = {}
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
                const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
                const __VLS_186 = __VLS_185({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }, ...__VLS_functionalComponentArgsRest(__VLS_185));
                ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeTitle") }, }));
                let __VLS_190;
                const __VLS_191 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel3)))
                            return;
                        if (!((node.father_id == __VLS_ctx.level3 && __VLS_ctx.level3 != null && !node.is_deleted)))
                            return;
                        __VLS_ctx.show4Node(node);
                        // @ts-ignore
                        [show4Node, level3, level3,];
                    }
                };
                const __VLS_189 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_184, __VLS_186));
                let __VLS_187;
                let __VLS_188;
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (node.node_name);
                __VLS_nonNullable(__VLS_189.slots).default;
                // @ts-ignore
                const __VLS_192 = {}
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
                const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                const __VLS_194 = __VLS_193({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }, ...__VLS_functionalComponentArgsRest(__VLS_193));
                ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                let __VLS_198;
                const __VLS_199 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel3)))
                            return;
                        if (!((node.father_id == __VLS_ctx.level3 && __VLS_ctx.level3 != null && !node.is_deleted)))
                            return;
                        __VLS_ctx.showNodeDelete(node, 'input3');
                        // @ts-ignore
                        [showNodeDelete,];
                    }
                };
                const __VLS_197 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_192, __VLS_194));
                let __VLS_195;
                let __VLS_196;
                // @ts-ignore
                const __VLS_200 = {}
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
                const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
                const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
                ({}({}));
                const __VLS_205 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_200, __VLS_202));
                // @ts-ignore
                const __VLS_206 = {}
                    .Delete;
                ({}.Delete);
                __VLS_components.Delete;
                // @ts-ignore
                [Delete,];
                // @ts-ignore
                const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({}));
                const __VLS_208 = __VLS_207({}, ...__VLS_functionalComponentArgsRest(__VLS_207));
                ({}({}));
                const __VLS_211 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_206, __VLS_208));
                __VLS_nonNullable(__VLS_205.slots).default;
                __VLS_nonNullable(__VLS_197.slots).default;
            }
        }
        if (__VLS_ctx.showInput3) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("inputBox") }, });
            // @ts-ignore
            const __VLS_212 = {}
                .ElInput;
            ({}.ElInput);
            __VLS_components.ElInput;
            __VLS_components.elInput;
            // @ts-ignore
            [ElInput,];
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            const __VLS_214 = __VLS_213({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            ({}({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            let __VLS_218;
            const __VLS_219 = {
                onKeyup: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel3)))
                        return;
                    if (!((__VLS_ctx.showInput3)))
                        return;
                    __VLS_ctx.inputNode(__VLS_ctx.level3, 'input3');
                    // @ts-ignore
                    [inputNodeName, inputNode, level3, showInput3,];
                }
            };
            const __VLS_220 = {
                onBlur: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel3)))
                        return;
                    if (!((__VLS_ctx.showInput3)))
                        return;
                    __VLS_ctx.handleNodeAdd('input3');
                    // @ts-ignore
                    [handleNodeAdd,];
                }
            };
            const __VLS_217 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_212, __VLS_214));
            let __VLS_215;
            let __VLS_216;
        }
        else if (__VLS_ctx.level3 || (!__VLS_ctx.level3 && __VLS_ctx.level2)) {
            // @ts-ignore
            const __VLS_221 = {}
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
            const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            const __VLS_223 = __VLS_222({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }, ...__VLS_functionalComponentArgsRest(__VLS_222));
            ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            let __VLS_227;
            const __VLS_228 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel3)))
                        return;
                    if (!(!((__VLS_ctx.showInput3))))
                        return;
                    if (!((__VLS_ctx.level3 || (!__VLS_ctx.level3 && __VLS_ctx.level2))))
                        return;
                    __VLS_ctx.handleNodeAdd('input3');
                    // @ts-ignore
                    [handleNodeAdd, level2, level3, level3,];
                }
            };
            const __VLS_226 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_221, __VLS_223));
            let __VLS_224;
            let __VLS_225;
            // @ts-ignore
            const __VLS_229 = {}
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
            const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_231 = __VLS_230({ ...{ class: ("nodeAddIcon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_230));
            ({}({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_234 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_229, __VLS_231));
            // @ts-ignore
            const __VLS_235 = {}
                .Plus;
            ({}.Plus);
            __VLS_components.Plus;
            // @ts-ignore
            [Plus,];
            // @ts-ignore
            const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({}));
            const __VLS_237 = __VLS_236({}, ...__VLS_functionalComponentArgsRest(__VLS_236));
            ({}({}));
            const __VLS_240 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_235, __VLS_237));
            __VLS_nonNullable(__VLS_234.slots).default;
            __VLS_nonNullable(__VLS_226.slots).default;
        }
    }
    if (__VLS_ctx.showLevel4) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("smallBox forth") }, });
        for (const [node] of __VLS_getVForSourceType((__VLS_ctx.team_structures))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((node.myself_id)), });
            if (node.father_id == __VLS_ctx.level4 && __VLS_ctx.level4 != null && !node.is_deleted) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("nodeBox") }, });
                // @ts-ignore
                const __VLS_241 = {}
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
                const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({ text: (true), ...{ class: ("nodeTitle") }, }));
                const __VLS_243 = __VLS_242({ text: (true), ...{ class: ("nodeTitle") }, }, ...__VLS_functionalComponentArgsRest(__VLS_242));
                ({}({ text: (true), ...{ class: ("nodeTitle") }, }));
                const __VLS_246 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_241, __VLS_243));
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (node.node_name);
                // @ts-ignore
                [team_structures, showLevel4, level4, level4,];
                __VLS_nonNullable(__VLS_246.slots).default;
                // @ts-ignore
                const __VLS_247 = {}
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
                const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                const __VLS_249 = __VLS_248({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }, ...__VLS_functionalComponentArgsRest(__VLS_248));
                ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeDelete") }, }));
                let __VLS_253;
                const __VLS_254 = {
                    onClick: (...[$event]) => {
                        if (!((__VLS_ctx.showLevel4)))
                            return;
                        if (!((node.father_id == __VLS_ctx.level4 && __VLS_ctx.level4 != null && !node.is_deleted)))
                            return;
                        __VLS_ctx.showNodeDelete(node, 'input4');
                        // @ts-ignore
                        [showNodeDelete,];
                    }
                };
                const __VLS_252 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_247, __VLS_249));
                let __VLS_250;
                let __VLS_251;
                // @ts-ignore
                const __VLS_255 = {}
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
                const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({}));
                const __VLS_257 = __VLS_256({}, ...__VLS_functionalComponentArgsRest(__VLS_256));
                ({}({}));
                const __VLS_260 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_255, __VLS_257));
                // @ts-ignore
                const __VLS_261 = {}
                    .Delete;
                ({}.Delete);
                __VLS_components.Delete;
                // @ts-ignore
                [Delete,];
                // @ts-ignore
                const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({}));
                const __VLS_263 = __VLS_262({}, ...__VLS_functionalComponentArgsRest(__VLS_262));
                ({}({}));
                const __VLS_266 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_261, __VLS_263));
                __VLS_nonNullable(__VLS_260.slots).default;
                __VLS_nonNullable(__VLS_252.slots).default;
            }
        }
        if (__VLS_ctx.showInput4) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("inputBox") }, });
            // @ts-ignore
            const __VLS_267 = {}
                .ElInput;
            ({}.ElInput);
            __VLS_components.ElInput;
            __VLS_components.elInput;
            // @ts-ignore
            [ElInput,];
            // @ts-ignore
            const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            const __VLS_269 = __VLS_268({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }, ...__VLS_functionalComponentArgsRest(__VLS_268));
            ({}({ ...{ 'onKeyup': {} }, ...{ 'onBlur': {} }, modelValue: ((__VLS_ctx.inputNodeName)), placeholder: ("请输入分组/职位名"), }));
            let __VLS_273;
            const __VLS_274 = {
                onKeyup: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel4)))
                        return;
                    if (!((__VLS_ctx.showInput4)))
                        return;
                    __VLS_ctx.inputNode(__VLS_ctx.level4, 'input4');
                    // @ts-ignore
                    [inputNodeName, inputNode, level4, showInput4,];
                }
            };
            const __VLS_275 = {
                onBlur: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel4)))
                        return;
                    if (!((__VLS_ctx.showInput4)))
                        return;
                    __VLS_ctx.handleNodeAdd('input4');
                    // @ts-ignore
                    [handleNodeAdd,];
                }
            };
            const __VLS_272 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_267, __VLS_269));
            let __VLS_270;
            let __VLS_271;
        }
        else if (__VLS_ctx.level4 || (!__VLS_ctx.level4 && __VLS_ctx.level3)) {
            // @ts-ignore
            const __VLS_276 = {}
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
            const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            const __VLS_278 = __VLS_277({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }, ...__VLS_functionalComponentArgsRest(__VLS_277));
            ({}({ ...{ 'onClick': {} }, text: (true), ...{ class: ("nodeAdd") }, }));
            let __VLS_282;
            const __VLS_283 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.showLevel4)))
                        return;
                    if (!(!((__VLS_ctx.showInput4))))
                        return;
                    if (!((__VLS_ctx.level4 || (!__VLS_ctx.level4 && __VLS_ctx.level3))))
                        return;
                    __VLS_ctx.handleNodeAdd('input4');
                    // @ts-ignore
                    [handleNodeAdd, level3, level4, level4,];
                }
            };
            const __VLS_281 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_276, __VLS_278));
            let __VLS_279;
            let __VLS_280;
            // @ts-ignore
            const __VLS_284 = {}
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
            const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_286 = __VLS_285({ ...{ class: ("nodeAddIcon") }, }, ...__VLS_functionalComponentArgsRest(__VLS_285));
            ({}({ ...{ class: ("nodeAddIcon") }, }));
            const __VLS_289 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_284, __VLS_286));
            // @ts-ignore
            const __VLS_290 = {}
                .Plus;
            ({}.Plus);
            __VLS_components.Plus;
            // @ts-ignore
            [Plus,];
            // @ts-ignore
            const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({}));
            const __VLS_292 = __VLS_291({}, ...__VLS_functionalComponentArgsRest(__VLS_291));
            ({}({}));
            const __VLS_295 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_290, __VLS_292));
            __VLS_nonNullable(__VLS_289.slots).default;
            __VLS_nonNullable(__VLS_281.slots).default;
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { footer: __VLS_thisSlot } = __VLS_nonNullable(__VLS_5.slots);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("buttonBox") }, });
        // @ts-ignore
        const __VLS_296 = {}
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
        const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({ ...{ 'onClick': {} }, ...{ class: ("reset") }, }));
        const __VLS_298 = __VLS_297({ ...{ 'onClick': {} }, ...{ class: ("reset") }, }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        ({}({ ...{ 'onClick': {} }, ...{ class: ("reset") }, }));
        let __VLS_302;
        const __VLS_303 = {
            onClick: (__VLS_ctx.resetTeam)
        };
        const __VLS_301 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_296, __VLS_298));
        let __VLS_299;
        let __VLS_300;
        // @ts-ignore
        [resetTeam,];
        __VLS_nonNullable(__VLS_301.slots).default;
        // @ts-ignore
        const __VLS_304 = {}
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
        const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save") }, }));
        const __VLS_306 = __VLS_305({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save") }, }, ...__VLS_functionalComponentArgsRest(__VLS_305));
        ({}({ ...{ 'onClick': {} }, type: ("primary"), ...{ class: ("save") }, }));
        let __VLS_310;
        const __VLS_311 = {
            onClick: (__VLS_ctx.saveTeam)
        };
        const __VLS_309 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_304, __VLS_306));
        let __VLS_307;
        let __VLS_308;
        // @ts-ignore
        [saveTeam,];
        __VLS_nonNullable(__VLS_309.slots).default;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("box-header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("title") }, ...{ style: ({}) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("currentTeam") }, ...{ style: ({}) }, });
    // @ts-ignore
    const __VLS_312 = {}
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
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({ ...{ 'onCommand': {} }, ...{ class: ("downMenu") }, }));
    const __VLS_314 = __VLS_313({ ...{ 'onCommand': {} }, ...{ class: ("downMenu") }, }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    ({}({ ...{ 'onCommand': {} }, ...{ class: ("downMenu") }, }));
    let __VLS_318;
    const __VLS_319 = {
        onCommand: (__VLS_ctx.handleCommand)
    };
    const __VLS_317 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_312, __VLS_314));
    let __VLS_315;
    let __VLS_316;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("el-dropdown-link") }, });
    (__VLS_ctx.selectedTeamName);
    // @ts-ignore
    const __VLS_320 = {}
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
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({ ...{ class: ("el-icon--right") }, }));
    const __VLS_322 = __VLS_321({ ...{ class: ("el-icon--right") }, }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    ({}({ ...{ class: ("el-icon--right") }, }));
    const __VLS_325 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_320, __VLS_322));
    // @ts-ignore
    const __VLS_326 = {}
        .CaretBottom;
    ({}.CaretBottom);
    __VLS_components.CaretBottom;
    // @ts-ignore
    [CaretBottom,];
    // @ts-ignore
    const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({}));
    const __VLS_328 = __VLS_327({}, ...__VLS_functionalComponentArgsRest(__VLS_327));
    ({}({}));
    const __VLS_331 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_326, __VLS_328));
    // @ts-ignore
    [handleCommand, selectedTeamName,];
    __VLS_nonNullable(__VLS_325.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { dropdown: __VLS_thisSlot } = __VLS_nonNullable(__VLS_317.slots);
        // @ts-ignore
        const __VLS_332 = {}
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
        const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({}));
        const __VLS_334 = __VLS_333({}, ...__VLS_functionalComponentArgsRest(__VLS_333));
        ({}({}));
        const __VLS_337 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_332, __VLS_334));
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.dropdownItems))) {
            // @ts-ignore
            const __VLS_338 = {}
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
            const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }));
            const __VLS_340 = __VLS_339({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }, ...__VLS_functionalComponentArgsRest(__VLS_339));
            ({}({ ...{ 'onClick': {} }, ...{ 'onMouseenter': {} }, ...{ 'onMouseleave': {} }, key: ((item.id)), ...{ class: (({ 'is-disabled': item.id === __VLS_ctx.selectedTeamId })) }, }));
            __VLS_styleScopedClasses = ({ 'is-disabled': item.id === selectedTeamId });
            let __VLS_344;
            const __VLS_345 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.selectTeamMember(item);
                    // @ts-ignore
                    [dropdownItems, selectedTeamId, selectTeamMember,];
                }
            };
            const __VLS_346 = {
                onMouseenter: (...[$event]) => {
                    __VLS_ctx.hoverItem = item;
                    // @ts-ignore
                    [hoverItem,];
                }
            };
            const __VLS_347 = {
                onMouseleave: (...[$event]) => {
                    __VLS_ctx.hoverItem = null;
                    // @ts-ignore
                    [hoverItem,];
                }
            };
            const __VLS_343 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_338, __VLS_340));
            let __VLS_341;
            let __VLS_342;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.name);
            __VLS_nonNullable(__VLS_343.slots).default;
        }
        if (__VLS_ctx.addNewTeam) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            if (__VLS_ctx.showAddTeam) {
                // @ts-ignore
                const __VLS_348 = {}
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
                const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({ ...{ 'onClick': {} }, }));
                const __VLS_350 = __VLS_349({ ...{ 'onClick': {} }, }, ...__VLS_functionalComponentArgsRest(__VLS_349));
                ({}({ ...{ 'onClick': {} }, }));
                let __VLS_354;
                const __VLS_355 = {
                    onClick: (__VLS_ctx.toggleAddTeam)
                };
                const __VLS_353 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_348, __VLS_350));
                let __VLS_351;
                let __VLS_352;
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                // @ts-ignore
                [addNewTeam, showAddTeam, toggleAddTeam,];
                __VLS_nonNullable(__VLS_353.slots).default;
            }
            else {
                // @ts-ignore
                const __VLS_356 = {}
                    .ElInput;
                ({}.ElInput);
                __VLS_components.ElInput;
                __VLS_components.elInput;
                // @ts-ignore
                [ElInput,];
                // @ts-ignore
                const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }));
                const __VLS_358 = __VLS_357({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }, ...__VLS_functionalComponentArgsRest(__VLS_357));
                ({}({ ...{ 'onKeyup': {} }, modelValue: ((__VLS_ctx.teamName)), ...{ style: ({}) }, placeholder: ("请输入团队名称"), }));
                let __VLS_362;
                const __VLS_363 = {
                    onKeyup: (__VLS_ctx.addTeam)
                };
                const __VLS_361 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_356, __VLS_358));
                let __VLS_359;
                let __VLS_360;
                // @ts-ignore
                [teamName, addTeam,];
            }
        }
        __VLS_nonNullable(__VLS_337.slots).default;
    }
    if (__VLS_ctx.urls != 0) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("btn-group") }, });
        if (__VLS_ctx.TeamStrManage) {
            // @ts-ignore
            const __VLS_364 = {}
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
            const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({ type: ("primary"), plain: (true), ...{ class: ("btn1") }, }));
            const __VLS_366 = __VLS_365({ type: ("primary"), plain: (true), ...{ class: ("btn1") }, }, ...__VLS_functionalComponentArgsRest(__VLS_365));
            ({}({ type: ("primary"), plain: (true), ...{ class: ("btn1") }, }));
            const __VLS_369 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_364, __VLS_366));
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ onClick: (...[$event]) => {
                        if (!((__VLS_ctx.urls != 0)))
                            return;
                        if (!((__VLS_ctx.TeamStrManage)))
                            return;
                        __VLS_ctx.handleTeamManage();
                        // @ts-ignore
                        [urls, TeamStrManage, handleTeamManage,];
                    } }, ...{ class: ("btn-content") }, });
            __VLS_nonNullable(__VLS_369.slots).default;
        }
        if (__VLS_ctx.addMember) {
            // @ts-ignore
            const __VLS_370 = {}
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
            const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("btn2") }, }));
            const __VLS_372 = __VLS_371({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("btn2") }, }, ...__VLS_functionalComponentArgsRest(__VLS_371));
            ({}({ ...{ 'onClick': {} }, type: ("primary"), plain: (true), ...{ class: ("btn2") }, }));
            let __VLS_376;
            const __VLS_377 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.urls != 0)))
                        return;
                    if (!((__VLS_ctx.addMember)))
                        return;
                    __VLS_ctx.handleAddUser(__VLS_ctx.selectedTeamId, __VLS_ctx.selectedTeamName, __VLS_ctx.level);
                    // @ts-ignore
                    [selectedTeamName, selectedTeamId, addMember, handleAddUser, level,];
                }
            };
            const __VLS_375 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_370, __VLS_372));
            let __VLS_373;
            let __VLS_374;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("btn-content") }, });
            __VLS_nonNullable(__VLS_375.slots).default;
        }
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("box-team") }, ...{ style: ({}) }, });
    // @ts-ignore
    const __VLS_378 = {}
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
    const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({ data: ((__VLS_ctx.currentData)), stripe: (true), ...{ style: ({}) }, ...{ class: ("large-text-table") }, }));
    const __VLS_380 = __VLS_379({ data: ((__VLS_ctx.currentData)), stripe: (true), ...{ style: ({}) }, ...{ class: ("large-text-table") }, }, ...__VLS_functionalComponentArgsRest(__VLS_379));
    ({}({ data: ((__VLS_ctx.currentData)), stripe: (true), ...{ style: ({}) }, ...{ class: ("large-text-table") }, }));
    const __VLS_383 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_378, __VLS_380));
    // @ts-ignore
    const __VLS_384 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({ prop: ("name"), label: ("姓名"), }));
    const __VLS_386 = __VLS_385({ prop: ("name"), label: ("姓名"), }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    ({}({ prop: ("name"), label: ("姓名"), }));
    const __VLS_389 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_384, __VLS_386));
    // @ts-ignore
    [currentData,];
    // @ts-ignore
    const __VLS_390 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({ prop: ("positions"), label: ("组别"), }));
    const __VLS_392 = __VLS_391({ prop: ("positions"), label: ("组别"), }, ...__VLS_functionalComponentArgsRest(__VLS_391));
    ({}({ prop: ("positions"), label: ("组别"), }));
    const __VLS_395 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_390, __VLS_392));
    // @ts-ignore
    const __VLS_396 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({ prop: ("grade"), label: ("年级"), }));
    const __VLS_398 = __VLS_397({ prop: ("grade"), label: ("年级"), }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    ({}({ prop: ("grade"), label: ("年级"), }));
    const __VLS_401 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_396, __VLS_398));
    // @ts-ignore
    const __VLS_402 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({ prop: ("major"), label: ("专业"), }));
    const __VLS_404 = __VLS_403({ prop: ("major"), label: ("专业"), }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    ({}({ prop: ("major"), label: ("专业"), }));
    const __VLS_407 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_402, __VLS_404));
    // @ts-ignore
    const __VLS_408 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({ prop: ("status"), label: ("现状"), }));
    const __VLS_410 = __VLS_409({ prop: ("status"), label: ("现状"), }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    ({}({ prop: ("status"), label: ("现状"), }));
    const __VLS_413 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_408, __VLS_410));
    // @ts-ignore
    const __VLS_414 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({ prop: ("phone_num"), label: ("联系方式"), }));
    const __VLS_416 = __VLS_415({ prop: ("phone_num"), label: ("联系方式"), }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    ({}({ prop: ("phone_num"), label: ("联系方式"), }));
    const __VLS_419 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_414, __VLS_416));
    // @ts-ignore
    const __VLS_420 = {}
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
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({ label: ("操作"), width: ("auto"), }));
    const __VLS_422 = __VLS_421({ label: ("操作"), width: ("auto"), }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    ({}({ label: ("操作"), width: ("auto"), }));
    const __VLS_425 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_420, __VLS_422));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { default: __VLS_thisSlot } = __VLS_nonNullable(__VLS_425.slots);
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        // @ts-ignore
        const __VLS_426 = {}
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
        const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({ ...{ 'onClick': {} }, type: ("text"), }));
        const __VLS_428 = __VLS_427({ ...{ 'onClick': {} }, type: ("text"), }, ...__VLS_functionalComponentArgsRest(__VLS_427));
        ({}({ ...{ 'onClick': {} }, type: ("text"), }));
        let __VLS_432;
        const __VLS_433 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleViewDetail(scope.row.id);
                // @ts-ignore
                [handleViewDetail,];
            }
        };
        const __VLS_431 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_426, __VLS_428));
        let __VLS_429;
        let __VLS_430;
        __VLS_nonNullable(__VLS_431.slots).default;
        if (__VLS_ctx.deleteMember) {
            // @ts-ignore
            const __VLS_434 = {}
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
            const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({ ...{ 'onClick': {} }, type: ("text"), ...{ class: ("delete") }, }));
            const __VLS_436 = __VLS_435({ ...{ 'onClick': {} }, type: ("text"), ...{ class: ("delete") }, }, ...__VLS_functionalComponentArgsRest(__VLS_435));
            ({}({ ...{ 'onClick': {} }, type: ("text"), ...{ class: ("delete") }, }));
            let __VLS_440;
            const __VLS_441 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.deleteMember)))
                        return;
                    __VLS_ctx.showDelete(scope.row.id);
                    // @ts-ignore
                    [deleteMember, showDelete,];
                }
            };
            const __VLS_439 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_434, __VLS_436));
            let __VLS_437;
            let __VLS_438;
            // @ts-ignore
            const __VLS_442 = {}
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
            const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({}));
            const __VLS_444 = __VLS_443({}, ...__VLS_functionalComponentArgsRest(__VLS_443));
            ({}({}));
            const __VLS_447 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_442, __VLS_444));
            // @ts-ignore
            const __VLS_448 = {}
                .DeleteFilled;
            ({}.DeleteFilled);
            __VLS_components.DeleteFilled;
            // @ts-ignore
            [DeleteFilled,];
            // @ts-ignore
            const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({}));
            const __VLS_450 = __VLS_449({}, ...__VLS_functionalComponentArgsRest(__VLS_449));
            ({}({}));
            const __VLS_453 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_448, __VLS_450));
            __VLS_nonNullable(__VLS_447.slots).default;
            __VLS_nonNullable(__VLS_439.slots).default;
        }
        __VLS_nonNullable(__VLS_425.slots)['' /* empty slot name completion */];
    }
    __VLS_nonNullable(__VLS_383.slots).default;
    // @ts-ignore
    const __VLS_454 = {}
        .ElPagination;
    ({}.ElPagination);
    __VLS_components.ElPagination;
    __VLS_components.elPagination;
    // @ts-ignore
    [ElPagination,];
    // @ts-ignore
    const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages)), pageSize: ((__VLS_ctx.pageSize)), }));
    const __VLS_456 = __VLS_455({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages)), pageSize: ((__VLS_ctx.pageSize)), }, ...__VLS_functionalComponentArgsRest(__VLS_455));
    ({}({ ...{ 'onCurrentChange': {} }, layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages)), pageSize: ((__VLS_ctx.pageSize)), }));
    let __VLS_460;
    const __VLS_461 = {
        onCurrentChange: (__VLS_ctx.handlePageChange)
    };
    const __VLS_459 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_454, __VLS_456));
    let __VLS_457;
    let __VLS_458;
    // @ts-ignore
    [totalPages, pageSize, handlePageChange,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['custom-title'];
        __VLS_styleScopedClasses['header'];
        __VLS_styleScopedClasses['teamTitle'];
        __VLS_styleScopedClasses['teamDownMenu'];
        __VLS_styleScopedClasses['el-dropdown-link'];
        __VLS_styleScopedClasses['el-icon--right'];
        __VLS_styleScopedClasses['bigBox'];
        __VLS_styleScopedClasses['smallBox'];
        __VLS_styleScopedClasses['first'];
        __VLS_styleScopedClasses['nodeBox'];
        __VLS_styleScopedClasses['nodeTitle'];
        __VLS_styleScopedClasses['nodeDelete'];
        __VLS_styleScopedClasses['inputBox'];
        __VLS_styleScopedClasses['nodeAdd'];
        __VLS_styleScopedClasses['nodeAddIcon'];
        __VLS_styleScopedClasses['smallBox'];
        __VLS_styleScopedClasses['second'];
        __VLS_styleScopedClasses['nodeBox'];
        __VLS_styleScopedClasses['nodeTitle'];
        __VLS_styleScopedClasses['nodeDelete'];
        __VLS_styleScopedClasses['inputBox'];
        __VLS_styleScopedClasses['nodeAdd'];
        __VLS_styleScopedClasses['nodeAddIcon'];
        __VLS_styleScopedClasses['smallBox'];
        __VLS_styleScopedClasses['third'];
        __VLS_styleScopedClasses['nodeBox'];
        __VLS_styleScopedClasses['nodeTitle'];
        __VLS_styleScopedClasses['nodeDelete'];
        __VLS_styleScopedClasses['inputBox'];
        __VLS_styleScopedClasses['nodeAdd'];
        __VLS_styleScopedClasses['nodeAddIcon'];
        __VLS_styleScopedClasses['smallBox'];
        __VLS_styleScopedClasses['forth'];
        __VLS_styleScopedClasses['nodeBox'];
        __VLS_styleScopedClasses['nodeTitle'];
        __VLS_styleScopedClasses['nodeDelete'];
        __VLS_styleScopedClasses['inputBox'];
        __VLS_styleScopedClasses['nodeAdd'];
        __VLS_styleScopedClasses['nodeAddIcon'];
        __VLS_styleScopedClasses['buttonBox'];
        __VLS_styleScopedClasses['reset'];
        __VLS_styleScopedClasses['save'];
        __VLS_styleScopedClasses['box'];
        __VLS_styleScopedClasses['box-header'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['currentTeam'];
        __VLS_styleScopedClasses['downMenu'];
        __VLS_styleScopedClasses['el-dropdown-link'];
        __VLS_styleScopedClasses['el-icon--right'];
        __VLS_styleScopedClasses['btn-group'];
        __VLS_styleScopedClasses['btn1'];
        __VLS_styleScopedClasses['btn-content'];
        __VLS_styleScopedClasses['btn2'];
        __VLS_styleScopedClasses['btn-content'];
        __VLS_styleScopedClasses['box-team'];
        __VLS_styleScopedClasses['large-text-table'];
        __VLS_styleScopedClasses['delete'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                handleAddUser: handleAddUser,
                handleViewDetail: handleViewDetail,
                currentData: currentData,
                pageSize: pageSize,
                totalPages: totalPages,
                handlePageChange: handlePageChange,
                selectedTeamId: selectedTeamId,
                selectedTeamName: selectedTeamName,
                dropdownItems: dropdownItems,
                teamName: teamName,
                showAddTeam: showAddTeam,
                hoverItem: hoverItem,
                selectTeam: selectTeam,
                selectTeamMember: selectTeamMember,
                toggleAddTeam: toggleAddTeam,
                addTeam: addTeam,
                showDelete: showDelete,
                teamManageOptionShow: teamManageOptionShow,
                team_structures: team_structures,
                handleTeamManage: handleTeamManage,
                urls: urls,
                level: level,
                addNewTeam: addNewTeam,
                TeamStrManage: TeamStrManage,
                deleteMember: deleteMember,
                addMember: addMember,
                showLevel2: showLevel2,
                showLevel3: showLevel3,
                showLevel4: showLevel4,
                level1: level1,
                level2: level2,
                level3: level3,
                level4: level4,
                showInput1: showInput1,
                showInput2: showInput2,
                showInput3: showInput3,
                showInput4: showInput4,
                show2Node: show2Node,
                show3Node: show3Node,
                show4Node: show4Node,
                handleNodeAdd: handleNodeAdd,
                inputNodeName: inputNodeName,
                inputNode: inputNode,
                showNodeDelete: showNodeDelete,
                resetTeam: resetTeam,
                saveTeam: saveTeam,
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
