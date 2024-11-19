// @ts-nocheck
import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
import router from './router'

// 引入 Element Plus 和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue' // 引入所有图标

//font awesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import 'normalize.css'
import '@/assets/styles/common.scss'
import '@/utils/request'
import {post} from "@/utils/被废弃";
import {put} from "@/utils/被废弃";
import {get} from "@/utils/被废弃";
import {deleted} from "@/utils/被废弃";

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus) // 注册 Element Plus

// 全局注册图标
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component)
}

app.mount('#app')
Vue.prototype.post = post;
Vue.prototype.put = put;
Vue.prototype.get = get;
Vue.prototype.deleted = deleted;
 