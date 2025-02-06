<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <input type="email" v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Senha" />
            <button type="submit">Entrar</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('souzacomprog@gmail.com');
const password = ref('admin');

const handleLogin = async () => {
    try {
        await authStore.login({ email: email.value, password: password.value });
        router.push('/dashboard');
    } catch (error) {
        alert(error.message);
    }
};
</script>
