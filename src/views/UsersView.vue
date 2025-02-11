<template>
    <div class="home">
        <div v-if="loading" class="loading">
            <p>Verificando autenticaçao...</p>
        </div>

        <div v-else>
            <h1>Página de Usuarios</h1>

            <div class="user-info">
                <h2>Informaçoes do Usuário</h2>
                <p><strong>Email:</strong> {{ authStore.user }}</p>
                <p><strong>Permissoes:</strong> {{ authStore.permissions.join(', ') }}</p>
                <p><strong>Status do Token:</strong> {{ tokenStatus }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

const authStore = useAuthStore()
const loading = ref(true)
const tokenStatus = ref('Nao verificado')

const verifyAuthentication = async () => {
    
    try {
        loading.value = true

        await api.get('/me')

        tokenStatus.value = 'Token valido'
    } catch (error) {
        tokenStatus.value = 'Token invalido ou expirado'
        
        // O interceptor já vai lidar com o refresh token se necessário
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await verifyAuthentication()
})
</script>

<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.user-info {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}
</style>