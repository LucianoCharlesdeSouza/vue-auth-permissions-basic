<template>
    <nav>
        <ul>
            <li v-if="canAccess('dashboard')">
                <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li v-if="canAccess('users')">
                <router-link to="/users">Usuários</router-link>
            </li>
            <li v-if="canAccess('settings')">
                <router-link to="/settings">Configurações</router-link>
            </li>
            <li>
                <button @click="logout">Sair</button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { useMenu } from '@/composables/useMenu';

const { canAccess, logout } = useMenu();
</script>

<style>
li{
    margin-right: 20px;
    padding: 10px;
    list-style-type: none;
    cursor: pointer;
    transition: color 0.3s ease;

}
</style>