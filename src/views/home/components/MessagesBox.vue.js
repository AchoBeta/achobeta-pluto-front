/* __placeholder__ */
import { ref, onMounted, onUnmounted } from 'vue';
import { getMessages, markMessageAsRead, markMessagesAsRead } from '../utils/message.js';
import NoDataIcon from '@/assets/icons/no-data.svg';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const messages = ref([]); // 当前页的消息列表
const currentPage = ref(1); // 当前页码
const totalPages = ref(1); // 总页数
const messagesPerPage = 5; // 每页消息数（前端分页控件）
const showModal = ref(false); // 控制弹框显示状态
const modalContent = ref(''); // 弹框中的消息内容
const timestamp = ref(0); // 用于增量更新的时间戳
let intervalId = null; // 定时器 ID，用于定时检查更新
const atoken = localStorage.getItem('atoken') || ''; // 从 localStorage 获取用户令牌
//获取当前页消息
const fetchMessages = async (page = 1, timestamp = 0) => {
    try {
        const atoken = localStorage.getItem('atoken'); // 从 localStorage 获取 atoken
        console.log('Fetched atoken:', atoken);
        if (!atoken) {
            ElMessage.error('未检测到登录信息，请重新登录');
            return;
        }
        const data = await getMessages(atoken, page, timestamp); // 调用 getMessages 接口
        console.log('后端返回的数据:', data);
        if (data && data.code === 20000) {
            // 验证后端返回的 messages 是否是数组
            const fetchedMessages = Array.isArray(data.data?.messages)
                ? data.data.messages
                : []; // 如果不是数组，设置为空
            console.log('fetchedMessages:', fetchedMessages);
            if (!Array.isArray(fetchedMessages)) {
                console.error('后端返回的 messages 不是数组:', fetchedMessages);
                throw new Error('后端返回的 messages 数据格式错误');
            }
            // 确保 `is_read` 转换为布尔值
            messages.value = fetchedMessages
                .filter(msg => typeof msg === 'object' && msg.user_message_id && msg.content) // 过滤无效数据
                .map(msg => ({
                ...msg,
                is_read: msg.is_read === 1, // 确保 `is_read` 为布尔值
            }));
            // 日志输出验证
            console.log('messages.value after processing:', messages.value);
            // 更新分页信息
            totalPages.value = Number(data.data?.total_pages) || 1;
            currentPage.value = page;
            timestamp.value = Math.max(...(messages.value.map((msg) => msg.received_at) || []), 0);
        }
        else {
            // 处理其他错误
            console.error('后端返回的 code 非 20000:', data);
            handleApiError(data || {});
        }
    }
    catch (error) {
    }
};
// 错误处理函数
const handleApiError = (data = {}) => {
    const { code, message } = data;
    // 对未定义或格式错误的数据提供默认处理
    if (!code) {
        console.error('收到无效数据:', data);
        ElMessage.error('发生未知错误');
        return;
    }
    // 根据错误码处理不同情况
    switch (code) {
        case 60004:
            ElMessage.error('后台出现错误，请稍后重试');
            break;
        case -20000:
        case -20002:
            ElMessage.error('登录信息已过期，请重新登录');
            break;
        case -20003:
            ElMessage.error('程序出错，请联系开发人员');
            break;
        default:
            console.error('未知错误:', message || '请求失败');
            ElMessage.error(message || '请求失败，请稍后重试');
    }
};
//翻页时重新获取数据
const handlePageChange = async (page) => {
    try {
        console.log('切换到页面:', page);
        currentPage.value = page; // 更新当前页码
        await fetchMessages(page); // 获取对应页码的数据
    }
    catch (error) {
        console.error('页面切换错误:', error);
    }
};
//标记多条消息为已读
const markAllAsRead = async () => {
    const unreadMessages = messages.value.filter((msg) => !msg.is_read);
    if (messages.value.length === 0) {
        ElMessage.info('暂无消息');
        return;
    }
    if (unreadMessages.length === 0) {
        ElMessage.info('所有消息已是已读状态');
        return;
    }
    // 保存原始状态
    const previousStates = unreadMessages.map((msg) => ({
        message: msg,
        is_read: msg.is_read,
    }));
    // 乐观更新：将所有消息标记为已读
    unreadMessages.forEach((msg) => (msg.is_read = true));
    try {
        const data = await markMessagesAsRead();
        if (data.code !== 20000)
            throw new Error('后端返回错误');
        ElMessage.success('所有未读消息已成功标记为已读');
    }
    catch (error) {
        console.error('全部已读请求失败:', error);
        // 请求失败时恢复原始状态
        previousStates.forEach((msg) => {
            const original = messages.value.find((m) => m.user_message_id === msg.message.user_message_id);
            if (original)
                Object.assign(original, msg); // 恢复原始状态
        });
        if (error.type === 'timeout') {
            ElMessage.error('请求超时，请稍后重试');
        }
        else {
            ElMessage.error('标记消息失败，请稍后重试');
        }
    }
};
//标记单条消息为已读
const handleMessageClick = async (message) => {
    try {
        modalContent.value = message.content; // 展示消息内容
        showModal.value = true; // 打开消息详情弹框
        if (!message.is_read) {
            const previousState = message.is_read; // 保存原始状态
            message.is_read = true; // 乐观更新：立即标记为已读
            try {
                await markMessageAsRead(message.user_message_id); // 调用后端接口
                message.is_read = true; // 本地更新状态
            }
            catch (error) {
                console.error('标记消息为已读失败:', error.message || '未知错误');
                message.is_read = previousState; // 恢复原始状态
                ElMessage.error(error.message || '标记消息为已读失败');
            }
        }
    }
    catch (error) {
        console.error('展示消息失败:', error);
        ElMessage.error(error.message || '操作失败，请稍后重试');
    }
};
const closeModal = () => {
    showModal.value = false;
};
//定时检查更新
const checkForUpdates = async () => {
    try {
        const data = await getMessages(atoken, 1, timestamp.value);
        if (data.code === 200 && data.data.is_updated) {
            await fetchMessages(1);
        }
    }
    catch (error) {
        console.error('更新检查失败:', error);
    }
};
const handleVisibilityChange = () => {
    if (document.hidden) {
        if (intervalId)
            clearInterval(intervalId);
    }
    else {
        intervalId = setInterval(checkForUpdates, 60000);
    }
};
onMounted(() => {
    fetchMessages();
    intervalId = setInterval(checkForUpdates, 60000);
    document.addEventListener('visibilitychange', handleVisibilityChange);
});
onUnmounted(() => {
    if (intervalId)
        clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("box messages-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("messages-header") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({ ...{ class: ("box-title") }, });
    // @ts-ignore
    const __VLS_0 = {}
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
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onClick': {} }, type: ("primary"), text: (true), ...{ class: ("read-all-button") }, }));
    const __VLS_2 = __VLS_1({ ...{ 'onClick': {} }, type: ("primary"), text: (true), ...{ class: ("read-all-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    ({}({ ...{ 'onClick': {} }, type: ("primary"), text: (true), ...{ class: ("read-all-button") }, }));
    let __VLS_6;
    const __VLS_7 = {
        onClick: (__VLS_ctx.markAllAsRead)
    };
    const __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2));
    let __VLS_3;
    let __VLS_4;
    // @ts-ignore
    [markAllAsRead,];
    __VLS_nonNullable(__VLS_5.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({ ...{ class: ("message-list") }, });
    if (Array.isArray(__VLS_ctx.messages) && __VLS_ctx.messages.length > 0) {
        for (const [message] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({ key: ((message.user_message_id)), ...{ class: ("message-item") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onClick: (...[$event]) => {
                        if (!((Array.isArray(__VLS_ctx.messages) && __VLS_ctx.messages.length > 0)))
                            return;
                        __VLS_ctx.handleMessageClick(message);
                        // @ts-ignore
                        [messages, messages, messages, handleMessageClick,];
                    } }, ...{ class: ("dot-and-content") }, });
            if (!message.is_read) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("unread-dot") }, });
            }
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ((['message-content', { read: message.is_read }])) }, });
            __VLS_styleScopedClasses = (['message-content', { read: message.is_read }]);
            (message.content.length > 25
                ? message.content.slice(0, 25) + '...'
                : message.content);
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("message-right") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ((['message-type', { system: message.type === 0, team: message.type === 1 }])) }, });
            __VLS_styleScopedClasses = (['message-type', { system: message.type === 0, team: message.type === 1 }]);
            (message.type === 0 ? '系统通知' : '团队通知');
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("no-data-container") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.NoDataIcon)), alt: ("暂无消息"), ...{ class: ("no-data-icon") }, });
        // @ts-ignore
        [NoDataIcon,];
        __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("no-data-text") }, });
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("pagination-container") }, });
    // @ts-ignore
    const __VLS_8 = {}
        .ElPagination;
    ({}.ElPagination);
    __VLS_components.ElPagination;
    __VLS_components.elPagination;
    // @ts-ignore
    [ElPagination,];
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ ...{ 'onCurrentChange': {} }, background: (true), layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages * __VLS_ctx.messagesPerPage)), pageSize: ((__VLS_ctx.messagesPerPage)), currentPage: ((__VLS_ctx.currentPage)), }));
    const __VLS_10 = __VLS_9({ ...{ 'onCurrentChange': {} }, background: (true), layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages * __VLS_ctx.messagesPerPage)), pageSize: ((__VLS_ctx.messagesPerPage)), currentPage: ((__VLS_ctx.currentPage)), }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    ({}({ ...{ 'onCurrentChange': {} }, background: (true), layout: ("prev, pager, next"), total: ((__VLS_ctx.totalPages * __VLS_ctx.messagesPerPage)), pageSize: ((__VLS_ctx.messagesPerPage)), currentPage: ((__VLS_ctx.currentPage)), }));
    let __VLS_14;
    const __VLS_15 = {
        onCurrentChange: (__VLS_ctx.handlePageChange)
    };
    const __VLS_13 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10));
    let __VLS_11;
    let __VLS_12;
    // @ts-ignore
    [totalPages, messagesPerPage, messagesPerPage, currentPage, handlePageChange,];
    // @ts-ignore
    const __VLS_16 = {}
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
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({ modelValue: ((__VLS_ctx.showModal)), title: ("消息详情"), width: ("500px"), alignCenter: (true), ...{ class: ("custom-dialog") }, }));
    const __VLS_18 = __VLS_17({ modelValue: ((__VLS_ctx.showModal)), title: ("消息详情"), width: ("500px"), alignCenter: (true), ...{ class: ("custom-dialog") }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    ({}({ modelValue: ((__VLS_ctx.showModal)), title: ("消息详情"), width: ("500px"), alignCenter: (true), ...{ class: ("custom-dialog") }, }));
    const __VLS_21 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("modal-text") }, });
    (__VLS_ctx.modalContent);
    // @ts-ignore
    [showModal, modalContent,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        const { footer: __VLS_thisSlot } = __VLS_nonNullable(__VLS_21.slots);
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
        const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({ ...{ 'onClick': {} }, ...{ class: ("custom-close-button") }, }));
        const __VLS_24 = __VLS_23({ ...{ 'onClick': {} }, ...{ class: ("custom-close-button") }, }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        ({}({ ...{ 'onClick': {} }, ...{ class: ("custom-close-button") }, }));
        let __VLS_28;
        const __VLS_29 = {
            onClick: (__VLS_ctx.closeModal)
        };
        const __VLS_27 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24));
        let __VLS_25;
        let __VLS_26;
        // @ts-ignore
        [closeModal,];
        __VLS_nonNullable(__VLS_27.slots).default;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['box'];
        __VLS_styleScopedClasses['messages-box'];
        __VLS_styleScopedClasses['messages-header'];
        __VLS_styleScopedClasses['box-title'];
        __VLS_styleScopedClasses['read-all-button'];
        __VLS_styleScopedClasses['message-list'];
        __VLS_styleScopedClasses['message-item'];
        __VLS_styleScopedClasses['dot-and-content'];
        __VLS_styleScopedClasses['unread-dot'];
        __VLS_styleScopedClasses['message-right'];
        __VLS_styleScopedClasses['no-data-container'];
        __VLS_styleScopedClasses['no-data-icon'];
        __VLS_styleScopedClasses['no-data-text'];
        __VLS_styleScopedClasses['pagination-container'];
        __VLS_styleScopedClasses['custom-dialog'];
        __VLS_styleScopedClasses['modal-text'];
        __VLS_styleScopedClasses['custom-close-button'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                NoDataIcon: NoDataIcon,
                messages: messages,
                currentPage: currentPage,
                totalPages: totalPages,
                messagesPerPage: messagesPerPage,
                showModal: showModal,
                modalContent: modalContent,
                handlePageChange: handlePageChange,
                markAllAsRead: markAllAsRead,
                handleMessageClick: handleMessageClick,
                closeModal: closeModal,
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
