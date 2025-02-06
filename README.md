# vue-auth-permissions-basic
Um projeto básico de autenticação e controle de permissões usando Vue 3, Vue Router, Pinia e Vue Toastification.

## 🚀 Tecnologias

- Vue 3  
- Vue Router  
- Pinia (Gerenciamento de estado)  
- Axios (Requisições HTTP, Interceptors)  
- Vue Toastification (Notificações)  

## 📂 Estrutura do projeto

```plaintext
📦 raiz/vue-auth-permissions-basic
 ┣ api.php
```

```plaintext
📦 src
 ┣ 📂 components      # Componentes reutilizáveis
 ┣ 📂 composables     # Objetos reutilizáveis
 ┣ 📂 middlewares     # Middlewares
 ┣ 📂 router          # Configuração do Vue Router
 ┣ 📂 services        # API e chamadas HTTP
 ┣ 📂 stores          # Estado global (Pinia)
 ┣ 📂 views           # Páginas da aplicação
 ┣ 📜 main.js         # Arquivo principal da aplicação
 ┗ 📜 App.vue         # Componente raiz
```

## 🛠️ Instalação e Uso

1. Clone este repositório, instale as dependências, e suba os server's, tanto o do vue quanto do php para a api

   ```sh
   git clone https://github.com/LucianoCharlesdeSouza/vue-auth-permissions-basic.git
   
   cd vue-auth-permissions-basic  
   npm install
   npm run serve
   ```
2. Na raiz do projeto, suba o server embed do php(ou da maneira que voce ja tem disposto em seu ambiente

```sh
   php -S localhost:8000 api.php
```
   
## 🔐 Autenticação e Permissões

- Autenticação: O usuário faz login e recebe um token, armazenado em sessionStorage.
- Permissões: O sistema verifica se o usuário tem permissão antes de acessar certas rotas.
- Proteção de rotas: Middleware authGuard no beforeEach do Vue Router impede acessos indevidos.

## 🎉 Recursos
- ✔️ Login e logout com API (usando um script basico php, simulando uma api)
- ✔️ Redirecionamento automático baseado em autenticação
- ✔️ Controle de permissões por rota
- ✔️ Toasts amigáveis para feedback do usuário

## 📝 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo.
