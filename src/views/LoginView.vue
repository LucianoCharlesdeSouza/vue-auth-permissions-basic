<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin" class="login-form">
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
const router    = useRouter();

const email     = ref('souzacomprog@gmail.com');
const password  = ref('1234');

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: #007BFF;
}

.login-form button {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-form button:hover {
  background-color: #0056b3;
}

@media (max-width: 480px) {
  .login-container {
    margin: 2rem 1rem;
    padding: 1.5rem;
  }

  .login-form input,
  .login-form button {
    font-size: 0.9rem;
  }
}
</style>
