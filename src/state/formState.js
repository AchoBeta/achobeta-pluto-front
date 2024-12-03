import { ref } from 'vue';

export const isFormModified = ref(false); // 全局共享状态

export const setFormModified = (value) => {
  isFormModified.value = value;
};
