/* __placeholder__ */
import { ref, onMounted } from 'vue';
import { requestCaptcha, updateCountdown, resetGetCodeButton } from './utils/captcha.js';
import router from '@/router';
import { checkAutoLoginApi } from '@/axios/api/login';
import { login } from './utils/login.js';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const phoneInput = ref(null);
const phoneError = ref(null);
const captchaInput = ref(null);
const captchaError = ref(null);
const getCodeButton = ref(null);
const loginRemember = ref(false);
// 在页面加载时启动倒计时检查
onMounted(async () => {
    try {
        const rtoken = localStorage.getItem('rtoken');
        //console.log("自动登录-前端获取的rtoken:",rtoken);
        const response = await checkAutoLoginApi(rtoken);
        console.log("自动登录-后端响应:", response.data);
        if (response.data.code === 20000) {
            // 自动登录成功，跳转到主页
            router.push('/home');
            localStorage.setItem('rtoken', response.data.data.rtoken);
            localStorage.setItem('atoken', response.data.data.atoken);
        }
        else {
            // 自动登录失败，显示登录弹窗
            console.log('自动登录失败');
        }
    }
    catch (error) {
        // 处理请求错误
        console.error('Failed to check auto login:', error);
    }
    ;
    updateCountdown(getCodeButton.value, () => resetGetCodeButton(getCodeButton.value));
});
// 封装函数调用
const handleGetCodeClick = () => requestCaptcha(phoneInput.value, phoneError.value, () => updateCountdown(getCodeButton.value, () => resetGetCodeButton(getCodeButton.value)));
const handleLoginClick = async () => {
    await login(phoneInput.value, captchaInput.value, captchaError.value, loginRemember.value);
};
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("welcome") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("welcome-title") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ("/achobeta.ico"), alt: ("AchoBeta Logo"), ...{ class: ("welcome-image") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("login-box") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("input-group") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("phone"), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ref: ("phoneInput"), type: ("tel"), id: ("phone"), placeholder: ("请输入手机号码"), required: (true), });
    // @ts-ignore
    (__VLS_ctx.phoneInput);
    // @ts-ignore
    [phoneInput,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ref: ("phoneError"), id: ("phone-error"), ...{ class: ("error-message") }, });
    // @ts-ignore
    (__VLS_ctx.phoneError);
    // @ts-ignore
    [phoneError,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("input-group") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ for: ("captcha"), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ ref: ("captchaInput"), type: ("text"), id: ("captcha"), placeholder: ("请输入验证码"), required: (true), });
    // @ts-ignore
    (__VLS_ctx.captchaInput);
    // @ts-ignore
    [captchaInput,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.handleGetCodeClick) }, ref: ("getCodeButton"), ...{ class: ("get-code") }, });
    // @ts-ignore
    (__VLS_ctx.getCodeButton);
    // @ts-ignore
    [handleGetCodeClick, getCodeButton,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ref: ("captchaError"), id: ("captcha-error"), ...{ class: ("error-message") }, });
    // @ts-ignore
    (__VLS_ctx.captchaError);
    // @ts-ignore
    [captchaError,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("options") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.input)({ type: ("checkbox"), });
    (__VLS_ctx.loginRemember);
    // @ts-ignore
    [loginRemember,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.handleLoginClick) }, ...{ class: ("login-btn") }, });
    // @ts-ignore
    [handleLoginClick,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("note") }, });
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['container'];
        __VLS_styleScopedClasses['welcome'];
        __VLS_styleScopedClasses['welcome-title'];
        __VLS_styleScopedClasses['welcome-image'];
        __VLS_styleScopedClasses['login-box'];
        __VLS_styleScopedClasses['input-group'];
        __VLS_styleScopedClasses['error-message'];
        __VLS_styleScopedClasses['input-group'];
        __VLS_styleScopedClasses['get-code'];
        __VLS_styleScopedClasses['error-message'];
        __VLS_styleScopedClasses['options'];
        __VLS_styleScopedClasses['login-btn'];
        __VLS_styleScopedClasses['note'];
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    let __VLS_name;
    let __VLS_defineComponent;
    const __VLS_internalComponent = __VLS_defineComponent({
        setup() {
            return {
                phoneInput: phoneInput,
                phoneError: phoneError,
                captchaInput: captchaInput,
                captchaError: captchaError,
                getCodeButton: getCodeButton,
                loginRemember: loginRemember,
                handleGetCodeClick: handleGetCodeClick,
                handleLoginClick: handleLoginClick,
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
