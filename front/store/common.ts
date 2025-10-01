import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common-store', () => {
    const token = ref<string>('')

    return {
        token
    };
});
