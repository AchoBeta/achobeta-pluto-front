// @ts-nocheck
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useCountStore } from './countStore';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export default pinia;
export { useCountStore };
