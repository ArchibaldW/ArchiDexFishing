import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = defineStore('user-store', () => {
    const authCookie : any = useCookie('auth_token')

    const token = ref<string>(authCookie.value || '')
    
    const user : Object|null = computed(() => {
        return token.value ? jwtDecode(token.value) : null;
    })

    return {
        user
    };
});
