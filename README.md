# vue-auth-permissions-basic
Um projeto básico de autenticação e controle de permissões usando Vue 3, Vue Router, Pinia e Vue Toastification.

## 🚀 Tecnologias

- Vue 3  
- Vue Router  
- Pinia (Gerenciamento de estado)  
- Axios (Requisições HTTP)  
- Vue Toastification (Notificações)  

## 📂 Estrutura do projeto

```plaintext
📦 src
 ┣ 📂 components      # Componentes reutilizáveis
 ┣ 📂 views           # Páginas da aplicação
 ┣ 📂 router          # Configuração do Vue Router e middlewares
 ┣ 📂 stores          # Estado global (Pinia)
 ┣ 📂 services        # API e chamadas HTTP
 ┣ 📜 main.js         # Arquivo principal da aplicação
 ┗ 📜 App.vue         # Componente raiz
```
## 🛠️ Instalação e Uso

1. Clone este repositório, instale as dependências, e suba o server

   ```plaintext
   git clone https://github.com/seu-usuario/vue-auth-permissions-basic.git
   cd vue-auth-permissions-basic
   
   cd vue-auth-permissions-basic
   npm install
   npm run serve
```

## 🛠️ Instalação e Uso

Autenticação: O usuário faz login e recebe um token, armazenado em sessionStorage.
Permissões: O sistema verifica se o usuário tem permissão antes de acessar certas rotas.
Proteção de rotas: Middleware authGuard no beforeEach do Vue Router impede acessos indevidos.
