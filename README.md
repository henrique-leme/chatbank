# Financial Advice Chat

<p align="center">
  <img src="https://img.shields.io/static/v1?label=React&message=library&color=blue&style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/static/v1?label=TypeScript&message=language&color=blue&style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/static/v1?label=Vite&message=build-tool&color=green&style=for-the-badge&logo=vite"/>
  <img src="https://img.shields.io/static/v1?label=Express&message=framework&color=yellow&style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/static/v1?label=Firebase&message=service&color=orange&style=for-the-badge&logo=firebase"/>
  <img src="https://img.shields.io/static/v1?label=JWT&message=authentication&color=red&style=for-the-badge&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/static/v1?label=MongoDB&message=database&color=green&style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/static/v1?label=TailwindCSS&message=CSS%20framework&color=blue&style=for-the-badge&logo=tailwindcss"/>
  <img src="https://img.shields.io/static/v1?label=GitHub&message=actions&color=grey&style=for-the-badge&logo=github"/>
</p>

## Status do Projeto: ⚠️ Em Desenvolvimento

### Descrição

Financial Advice Chat é um serviço abrangente desenvolvido para fornecer aconselhamento financeiro personalizado através de um chat interativo. O frontend oferece uma experiência de usuário fluida e responsiva, enquanto o backend garante a gestão segura e eficiente dos dados. O projeto integra tecnologias modernas como React, TypeScript, Vite, Express, Firebase, JWT, MongoDB e Ollama para oferecer uma solução robusta e escalável.

### ⚙️ Funcionalidades

- **Frontend:**

  - Interface de Usuário para Conversas Financeiras
  - Integração com Backend via API REST
  - Design Responsivo
  - Componentes Interativos com TailwindCSS
  - Autenticação de Usuários com Firebase

- **Backend:**
  - Autenticação e Autorização de Usuários com JWT
  - Armazenamento Seguro e Realtime com Firestore
  - API RESTful
  - Integração com Modelos de IA via Ollama

### 📚 Documentação

Para uma documentação detalhada, consulte a [Documentação](#) (link será adicionado).

Para acessar a documentação localmente:

1. Clone o projeto.
2. Siga as instruções de configuração abaixo.

### 📝 Índice

- [Começando](#começando)
- [Como Executar](#como-executar)
- [Desenvolvimento](#desenvolvimento)
- [Autores](#autores)

## 🚀 Começando

Siga estas instruções para obter uma cópia do projeto rodando na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Certifique-se de ter instalado:

- Git
- Node.js
- npm
- Ollama
- Models do Ollama

### 🔧 Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/henrique-leme/chatbank.git
   ```

2. Navegue para a pasta do projeto:

   ```sh
   cd chatbank
   ```

3. Instale as dependências do frontend:

   ```sh
   cd financial-advice-chat-front
   npm install
   ```

4. Instale as dependências do backend:

   ```sh
   cd ../financial-advice-chat-backend
   npm install
   ```

5. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` para `.env` em ambas as pastas `financial-advice-chat-front` e `financial-advice-chat-backend`.

     ```sh
     cp .env.example .env
     ```

     **Nota:** No Windows, copie manualmente o arquivo `.env.example` e renomeie para `.env`.

6. Instale os modelos do Ollama:

   Abra um terminal e execute:

   ```sh
   ollama run llama3.1
   ollama run tim2nearfield/finance
   ```

   **Importante:** Abra o CMD, aguarde o download dos modelos e feche o terminal após o processo ser concluído.

7. Baixe a configuração de projeto do Firebase e copie para `financial-advice-chat-backend\src\config`, o arquivo deve ter o nome de adminsdk.json, e pode ser encontrado no console da aplicação dentro do [Firebase](https://console.firebase.google.com/u/1/project/financial-advice-chat/settings/general/web:Mjk1ODQ2M2ItZDg0MS00NWNlLWE2NjgtYjM3MDQ2YjY4MDdj?hl=pt-br)

## ⚙️ Como Executar

1. Inicie o servidor do Ollama:

   ```sh
   ollama serve
   ```

2. Inicie o backend:

   Abra um terminal, navegue para `financial-advice-chat-backend` e execute:

   ```sh
   npm run dev
   ```

3. Inicie o frontend:

   Abra outro terminal, navegue para `financial-advice-chat-front` e execute:

   ```sh
   npm start
   ```

**Nota:** É necessário que o frontend, backend e o servidor Ollama estejam rodando simultaneamente para o funcionamento correto do projeto.

### 📦 Deploy

- As etapas para deploy serão incluídas futuramente.

## 🛠️ Construído com

- **Frontend:**

  - [React](https://reactjs.org/) - Biblioteca para construção de interfaces de usuário
  - [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
  - [Vite](https://vitejs.dev/) - Ferramenta de build
  - [TailwindCSS](https://tailwindcss.com/) - Framework de CSS
  - [React Router](https://reactrouter.com/) - Gerenciamento de rotas
  - [Axios](https://axios-http.com/) - Cliente HTTP
  - [Firebase](https://firebase.google.com/) - Autenticação e serviços em tempo real
  - [Zod](https://zod.dev/) - Validação de esquemas

- **Backend:**

  - [Node.js](https://nodejs.org/) - Ambiente de execução
  - [Express](https://expressjs.com/) - Framework web
  - [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
  - [Firebase Firestore](https://firebase.google.com/products/firestore) - Banco de dados
  - [JWT](https://jwt.io/) - Autenticação
  - [Ollama](https://ollama.com/) - Integração com modelos de IA
  - [Cheerio](https://cheerio.js.org/) - Scraping de dados
  - [Puppeteer](https://pptr.dev/) - Automação de navegador

- **DevOps:**
  - [Git](https://git-scm.com/) - Controle de versão
  - [GitHub Actions](https://github.com/features/actions) - CI/CD

## ✒️ Autores

- **Seu Nome** - _Desenvolvedor Principal_ - [GitHub](https://github.com/henrique-leme)

Veja também a lista de [colaboradores](https://github.com/henrique-leme/financial-advice-chat/contributors) que participaram deste projeto.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎯 Conceitos e Arquitetura

- **Padrões de Design:**

  - **MVC (Model-View-Controller)**

- **Conceitos de Arquitetura:**

  - **Arquitetura em Camadas** (Apresentação, Aplicação/Backend, Dados, Infraestrutura)
  - **Autenticação e Autorização com JWT**
  - **Integração de IA usando Ollama**
  - **Scraping para coleta de dados financeiros**
  - **Sincronização em Tempo Real com Firebase Firestore**

- **Fluxo de Dados e Interações:**
  - Autenticação de usuários
  - Coleta e definição de perfil financeiro
  - Interação no chat com processamento de linguagem natural (NLP)
  - Armazenamento e gerenciamento de histórico de conversas
  - Sincronização e atualizações em tempo real

## 📌 Notas Adicionais

- **Hospedagem e Deploy:**

  - [Firebase Hosting](https://firebase.google.com/products/hosting)

- **Ferramentas de Desenvolvimento:**
  - [Visual Studio Code](https://code.visualstudio.com/) com extensões recomendadas para TypeScript e React

---

**Nota:** Este projeto está em desenvolvimento e novas funcionalidades e documentações serão adicionadas conforme o progresso.
