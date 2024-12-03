// @ts-nocheck
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useCountStore = defineStore('count', () => {
    const count = ref(0);
    const setCount = (num) => {
        count.value = num;
    };
    return {
        count,
        setCount
    };
}, {
    persist: false
});
