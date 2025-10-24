Timely - Agenda de Compromissos
Timely é uma plataforma completa para gerenciamento de tarefas e compromissos, com interfaces para web e mobile. O sistema foi projetado para ajudar usuários a organizar suas atividades diárias de forma eficiente, com um backend robusto em Node.js e interfaces reativas construídas com React e React Native.

✨ Funcionalidades Principais
Plataforma Dupla: Interface web e aplicativo mobile nativo compartilhando o mesmo backend.

Autenticação Segura: Sistema de registro e login com senhas criptografadas (Bcrypt) e gerenciamento de sessão via JSON Web Tokens (JWT).

Gerenciamento Completo de Tarefas (CRUD): Crie, leia, atualize e exclua tarefas através de uma interface modal intuitiva.

Visualização em Calendário: Um calendário interativo exibe todos os compromissos, permitindo navegação por mês, semana, dia e agenda.

Navegação Avançada no Calendário: Seletores de mês e ano para pular rapidamente para qualquer data desejada.

Categorias com Ícones: Organize tarefas em categorias (Reunião, Aniversário, Prova, etc.) com ícones correspondentes para fácil identificação visual.

Filtros Avançados: Filtre a lista de tarefas por texto, categoria ou status (pendente/concluído).

Notificações de Feedback: Mensagens de sucesso informam o usuário sobre o resultado de suas ações.

Seed de Dados: Um usuário admin com tarefas de exemplo é criado automaticamente na primeira inicialização do backend para facilitar testes e demonstrações.

🚀 Tecnologias Utilizadas
Backend
Node.js / Express.js: Para a construção da API REST.

MongoDB: Banco de dados NoSQL para armazenamento de dados.

JSON Web Token (JWT): Para autenticação de usuários.

Bcrypt.js: Para criptografia de senhas.

Frontend (Web)
React (Vite): Para a construção da interface de usuário.

React Router: Para o gerenciamento de rotas.

Axios: Para requisições HTTP.

React Big Calendar: Para a exibição do calendário interativo.

Frontend (Mobile)
React Native / Expo: Para o desenvolvimento do aplicativo mobile.

Expo Router: Para o sistema de navegação baseado em arquivos.

React Native Calendars: Para a exibição do calendário nativo.

Context API: Para o gerenciamento do estado de autenticação.

📋 Pré-requisitos
Antes de começar, certifique-se de que você tem os seguintes softwares instalados e configurados na sua máquina:

Node.js (versão 18 ou superior).

npm (geralmente instalado com o Node.js).

MongoDB Community Server: Essencial que o serviço do MongoDB esteja rodando localmente.

Java Development Kit (JDK) 17: Necessário para o build nativo do Android. Certifique-se de que a variável de ambiente JAVA_HOME está configurada corretamente.

App Expo Go: Instalado no seu smartphone (Android/iOS) para testar o app mobile.

⚙️ Instalação e Execução (Passo a Passo Detalhado)
Siga os passos abaixo para configurar e rodar a aplicação completa (Web e Mobile) em seu ambiente de desenvolvimento.

1. Clonar o Repositório
Primeiro, clone o projeto do GitHub para a sua máquina local.

Bash

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
2. Configurar e Rodar o Backend
O backend é o cérebro da aplicação e deve ser iniciado primeiro.

Bash

# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev
O servidor estará rodando em http://localhost:3333. Na primeira inicialização, ele criará o usuário admin@admin.com e o populará com tarefas de exemplo. Deixe este terminal rodando.

3. Configurar e Rodar a Aplicação Web
Em um novo terminal, siga os passos para a interface web.

Bash

# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie a aplicação web
npm run dev
A aplicação web estará disponível em http://localhost:5173. Você já pode fazer login com as credenciais de admin e usar o sistema.

4. Configurar e Rodar o Aplicativo Mobile
Esta etapa requer uma configuração de rede crucial.

4.1. Encontrar seu Endereço de IP Local
O app mobile não pode acessar localhost. Ele precisa do IP da sua máquina na rede local.

No Windows: Abra o Prompt de Comando (cmd) e digite ipconfig. Procure pelo "Endereço IPv4" da sua conexão Wi-Fi ou Ethernet (ex: 192.168.0.10).

No macOS/Linux: Abra o terminal e digite ifconfig ou ip addr.

4.2. Configurar a Conexão
Abra o arquivo mobile/config.js.

Substitua o placeholder pelo seu endereço de IP real.

JavaScript

// mobile/config.js
export const API_BASE_URL = 'http://SEU_IP_AQUI:3333';
4.3. Instalar e Iniciar o App
Em um terceiro terminal, siga os passos para a interface mobile.

Bash

# 1. Navegue até a pasta do mobile
cd mobile

# 2. Instale as dependências (pode demorar um pouco na primeira vez)
npm install

# 3. Inicie o servidor do Expo
npx expo start
Um QR code aparecerá no terminal.

4.4. Rodar no seu Dispositivo
Certifique-se de que seu smartphone e seu computador estão conectados na mesma rede Wi-Fi.

Abra o aplicativo Expo Go no seu celular.

Escaneie o QR code exibido no terminal.

O aplicativo "Timely" será carregado no seu celular.

💡 Como Usar
Credenciais de Administrador:

Email: admin@admin.com

Senha: admin123

Criar Novos Usuários: Use a tela de "Registre-se" tanto na web quanto no mobile.