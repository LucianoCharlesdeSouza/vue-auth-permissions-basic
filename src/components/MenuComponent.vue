<template>
  <nav class="menu">
    <ul class="menu-list">
      <li v-if="canAccess('dashboard')">
        <router-link to="/dashboard">Dashboard</router-link>
      </li>
      <li v-if="canAccess('users')">
        <router-link to="/users">Usuarios</router-link>
      </li>
    </ul>
    <button v-if="isAuth" @click="logout" class="logout-btn">Sair</button>
  </nav>
</template>

<script setup>
import { useMenu } from '@/composables/useMenu';

const { canAccess, logout, isAuth } = useMenu();
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.menu-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin: 0 15px;
}

.menu-list a {
  text-decoration: none;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease-in-out;
}

.menu-list a:hover {
  color: #007bff;
}

.logout-btn {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.logout-btn:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .menu {
    padding: 1rem;
  }

  .menu-list {
    flex-direction: column;
    align-items: center;
  }

  .menu-list li {
    margin: 10px 0;
  }

  .logout-btn {
    width: 100%;
  }
}
</style>
