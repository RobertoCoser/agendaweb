Timely - Agenda de Compromissos
Timely é uma aplicação web completa para gerenciamento de tarefas e compromissos, projetada para ajudar usuários a organizar suas atividades diárias de forma eficiente e visual. O sistema conta com um backend robusto em Node.js e um frontend reativo e moderno construído com React.

✨ Funcionalidades Principais
Autenticação de Usuários: Sistema seguro de registro e login com senhas criptografadas e tokens JWT.

Gerenciamento de Tarefas (CRUD): Crie, edite, exclua e visualize tarefas de forma completa.

Visualização em Calendário: Visualize todos os compromissos em um calendário interativo com navegação por mês, semana, dia e agenda.

Navegação Avançada no Calendário: Seleção rápida de mês e ano para facilitar a navegação em longos períodos.

Categorias e Ícones: Organize tarefas em categorias (Reunião, Aniversário, Prova, etc.) com ícones correspondentes para fácil identificação.

Filtros Avançados: Filtre a lista de tarefas por texto, categoria ou status (pendente/concluído).

Marcação de Status: Alterne facilmente o status de uma tarefa entre concluída e pendente.

Notificações de Feedback: Mensagens de sucesso informam o usuário sobre ações bem-sucedidas (criar, editar, excluir).

Usuário Admin Padrão: O sistema gera automaticamente um usuário administrador com dados de exemplo na primeira inicialização, facilitando testes e demonstrações.

🚀 Tecnologias Utilizadas
Backend
Node.js: Ambiente de execução do servidor.

Express.js: Framework para a construção da API REST.

MongoDB: Banco de dados NoSQL para armazenamento persistente de dados.

JSON Web Tokens (JWT): Para autenticação e gerenciamento de sessões seguras.

Bcrypt.js: Para criptografia de senhas.

Frontend
React (Vite): Biblioteca para a construção da interface de usuário.

React Router: Para o gerenciamento de rotas e navegação entre páginas.

Axios: Para realizar as requisições HTTP para o backend.

React Big Calendar: Componente para a exibição do calendário interativo.

React Icons: Para a utilização de ícones na interface.

📋 Pré-requisitos
Antes de começar, certifique-se de que você tem os seguintes softwares instalados na sua máquina:

Node.js (versão 14 ou superior)

npm (geralmente instalado com o Node.js)

MongoDB Community Server (servidor do banco de dados rodando localmente)

⚙️ Instalação e Execução
Siga os passos abaixo para rodar o projeto em um ambiente de desenvolvimento local.

1. Clonar o Repositório
Bash

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
2. Configurar e Rodar o Backend
Navegue até a pasta do backend e instale as dependências.

Bash

cd backend
npm install
Após a instalação, inicie o servidor de desenvolvimento.

Bash

npm run dev
O servidor estará rodando em http://localhost:3333. Na primeira inicialização, ele criará automaticamente o usuário admin@admin.com e o populará com tarefas de exemplo.

3. Configurar e Rodar o Frontend
Em um novo terminal, navegue até a pasta do frontend e instale as dependências.

Bash

cd frontend
npm install
Após a instalação, inicie a aplicação React.

Bash

npm run dev
A aplicação estará disponível no seu navegador em http://localhost:5173 (ou na porta indicada no terminal).

ใช้งาน Como Usar
Abra a aplicação no seu navegador. Você será direcionado para a tela de login.

Para acessar com o perfil de administrador pré-configurado, utilize as seguintes credenciais:

Email: admin@admin.com

Senha: admin

Você também pode criar um novo usuário clicando no link "Registre-se".

Após o login, você terá acesso a todas as funcionalidades do sistema.