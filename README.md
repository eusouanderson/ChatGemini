docker compose --env-file ./backend/.env up --build -d

## Sumário

1.  [Introdução](#1-introdução)
2.  [Visão Geral do Projeto](#2-visão-geral-do-projeto)
    - [Recursos Principais](#recursos-principais)
    - [Tecnologias Utilizadas](#tecnologias-utilizadas)
3.  [Estrutura do Projeto](#3-estrutura-do-projeto)
    - [Raiz do Projeto](#raiz-do-projeto)
    - [Frontend (`frontend/`)](#frontend-frontend)
      - [Visão Geral](#visão-geral-frontend)
      - [Arquitetura de Componentes (Atomic Design)](#arquitetura-de-componentes-atomic-design)
      - [Principais Diretórios do `src`](#principais-diretórios-do-src)
    - [Backend (`backend/`)](#backend-backend)
      - [Visão Geral](#visão-geral-backend)
      - [Arquitetura (Clean / Hexagonal)](#arquitetura-clean--hexagonal)
      - [Principais Diretórios do `src`](#principais-diretórios-do-src-1)
4.  [Configuração e Instalação](#4-configuração-e-instalação)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Configuração](#passos-para-configuração)
    - [Executando a Aplicação](#executando-a-aplicação)
5.  [Fluxo de Desenvolvimento](#5-fluxo-de-desenvolvimento)
    - [Testes](#testes)
    - [Testando APIs com `client.http`](#testando-apis-com-clienthttp)
6.  [Observações e Considerações Futuras](#6-observações-e-considerações-futuras)
7.  [Contribuindo](#7-contribuindo)
8.  [Licença](#8-licença)
9.  [Contato](#9-contato)

---

## 1. Introdução

O `ChatGemini` é um projeto de aplicação de chat full-stack desenvolvido por Anderson, que utiliza a inteligência artificial do Gemini para conversas. O projeto é dividido em dois microsserviços principais: um frontend moderno construído com Vue.js e um backend robusto em TypeScript/Bun. O desenvolvimento é focado em performance, manutenibilidade e escalabilidade, seguindo as melhores práticas de arquitetura de software e utilizando tecnologias de ponta.

## 2. Visão Geral do Projeto

### Recursos Principais

- **Chat Habilitado por IA:** Integração com a API Gemini para respostas inteligentes.
- **Interface de Usuário Moderna:** Frontend dinâmico e responsivo construído com Vue.js e Vuetify/Tailwind CSS.
- **Arquitetura Robusta:** Backend em TypeScript com arquitetura limpa (Clean/Hexagonal Architecture).
- **Gerenciamento de Estado Otimizado:** Uso de Pinia para um gerenciamento de estado eficiente no frontend.
- **Persistência de Dados:** Banco de dados PostgreSQL com Drizzle ORM e cache/fila com Redis.
- **Containerização:** Ambientes de desenvolvimento e produção consistentes através de Docker e Docker Compose.
- **Desenvolvimento Rápido:** Utilização de Bun e Vite para um fluxo de trabalho de desenvolvimento ágil.

### Tecnologias Utilizadas

**Geral:**

- **Bun:** Runtime JavaScript/TypeScript rápido e gerenciador de pacotes unificado.
- **TypeScript:** Linguagem de programação para tipagem forte e detecção precoce de erros.
- **Docker:** Para containerização e gerenciamento de ambientes.
- **Docker Compose:** Para orquestração de serviços multi-container.

**Frontend (`frontend/`):**

- **Framework:** Vue.js (v3.5.17 - `beta/alpha`)
- **Bundler:** Vite (v6.3.5 - `beta/alpha`)
- **Gerenciamento de Estado:** Pinia (v3.0.3 - `beta/alpha`)
- **UI Framework/Componentes:** Vuetify (v3.9.2)
- **Estilização:** Tailwind CSS (v4.1.11 - `alpha`)
- **Roteamento:** Vue Router (v4.5.1)
- **Requisições HTTP:** Axios (v1.11.0)
- **Processamento de Conteúdo:** `marked` (Markdown parsing), `highlight.js` (code highlighting), `dompurify` (HTML sanitization).
- **Utilitários:** `uuid` (geração de IDs únicos).
- **Fontes e Ícones:** `@fontsource/roboto`, `@mdi/font`, `@mdi/js`.
- **Ferramentas de Build:** `npm-run-all2`, `sass-embedded`, `unplugin-fonts`, `unplugin-vue-components`, `vite-plugin-vuetify`.

**Backend (`backend/`):**

- **Runtime:** Bun
- **ORM:** Drizzle ORM
- **Banco de Dados:** PostgreSQL
- **Cache/Mensagens:** Redis
- **Servidor HTTP:** (Implícito pelo uso de `controller/` e `routes/`, provavelmente usando a API nativa do Bun ou um framework como Elysia/Hono que se integre bem com Bun)

## 3. Estrutura do Projeto

O projeto `ChatGemini` adota uma estrutura de monorepo implícita, com o frontend e o backend residindo em diretórios separados na raiz do projeto, permitindo desenvolvimento e deploy independentes, mas com fácil acesso cruzado durante o desenvolvimento.

### Raiz do Projeto

.
├── backend/ # Código-fonte do servidor API e lógica de negócio
├── frontend/ # Código-fonte da aplicação web do cliente
├── bun.lock # Lockfile global do Bun (se houver um workspace Bun na raiz)
└── README.md # Documentação principal do projeto

### Frontend (`frontend/`)

O diretório `frontend/` contém toda a aplicação Vue.js, estruturada para modularidade e escalabilidade.

#### Visão Geral - Frontend

frontend/
├── bun.lock # Lockfile do Bun para dependências do frontend
├── components.d.ts # Arquivo de tipos gerado para componentes Vue
├── env.d.ts # Arquivo de declaração de tipos para variáveis de ambiente
├── index.html # Ponto de entrada HTML da aplicação
├── package.json # Definições de pacotes, scripts e dependências do frontend
├── public/ # Arquivos estáticos servidos diretamente (ex: favicon)
├── README.md # Documentação específica do frontend
├── src/ # Código fonte principal da aplicação Vue.js
│ ├── App.vue # Componente raiz da aplicação
│ ├── assets/ # Recursos estáticos (imagens, estilos globais)
│ ├── components/ # Componentes Vue, organizados por Atomic Design
│ ├── main.ts # Ponto de entrada TypeScript da aplicação Vue
│ ├── page/ # Páginas (views) principais da aplicação
│ ├── plugins/ # Configurações para bibliotecas de terceiros (ex: Vuetify)
│ ├── router/ # Configuração do Vue Router
│ └── service/ # Lógica de comunicação com o backend (APIs)
├── tsconfig.app.json # Configuração TypeScript específica da aplicação
├── tsconfig.json # Configuração TypeScript base
├── tsconfig.node.json # Configuração TypeScript para o ambiente Node.js (Vite)
└── vite.config.ts # Configuração do Vite para build e desenvolvimento

#### Arquitetura de Componentes (Atomic Design)

A pasta `src/components/` segue o princípio de Atomic Design para organizar componentes, promovendo reusabilidade e manutenibilidade.

- `atoms/`: Componentes básicos, menores e reutilizáveis, que não dependem de outros componentes.
  - `AutoResizeInput.vue`: Um campo de entrada com redimensionamento automático.
  - `Button.vue`: Componente de botão genérico.
  - `ChatMessage.vue`\*: (Observado também em `molecules`, ver [Observações](#6-observações-e-considerações-futuras)) Um átomo para exibição de mensagens.
  - `MarkdownRenderer.vue`: Renderiza conteúdo Markdown.
- `molecules/`: Combinações de átomos que formam unidades funcionais.
  - `ChatInput.vue`: Campo de entrada de chat, combinando `AutoResizeInput` e talvez um `Button`.
  - `ChatList.vue`: Exibe uma lista de conversas/tópicos.
  - `ChatMessagesList.vue`: Exibe uma lista de mensagens dentro de uma conversa.
  - `ChatMessage.vue`\*: (Observado também em `atoms`, ver [Observações](#6-observações-e-considerações-futuras)) Uma molécula para uma mensagem de chat completa (incluindo avatar, nome, etc.).
  - `ThinkingIndicator.vue`: Indicador visual de processamento de IA.
  - `TopicList.vue`: Lista de tópicos de conversa.
- `organisms/`: Grupos de moléculas e átomos que formam seções mais complexas e específicas de uma interface, como cabeçalhos, rodapés ou painéis.
  - `ChatPanel.vue`: Painel completo de chat.
  - `TopicPanel.vue`: Painel para gerenciamento de tópicos.
- `models/`: (Atualmente vazia) Destinada a conter interfaces e tipos TypeScript para modelos de dados compartilhados entre componentes.

#### Principais Diretórios do `src` - Frontend

- `src/assets/`: Contém arquivos estáticos como imagens (`logo.png`, `logo.svg`) e estilos globais (`styles/main.css`).
- `src/page/`: Abriga os componentes de "página" que representam as principais telas da aplicação (ex: `ChatPage.vue`).
- `src/plugins/`: Usado para configurar e inicializar bibliotecas de terceiros (ex: `vuetify.ts` para Vuetify).
- `src/router/`: Define as rotas da aplicação usando Vue Router (`index.ts`).
- `src/service/`: Contém a lógica para interação com as APIs do backend, separando a preocupação de comunicação de rede dos componentes de UI (ex: `chat.ts`, `topic.ts`).

### Backend (`backend/`)

O diretório `backend/` hospeda o servidor API do projeto, implementando uma arquitetura limpa para garantir modularidade, testabilidade e escalabilidade.

#### Visão Geral - Backend

backend/
├── bun.lock # Lockfile do Bun para dependências do backend
├── bun.test.ts # Arquivo de testes Bun
├── client.http # Ferramenta para testar endpoints da API
├── docker-compose.yml # Configuração para orquestrar serviços Docker
├── Dockerfile # Definição da imagem Docker do backend
├── drizzle.config.ts # Configuração do Drizzle ORM
├── package.json # Definições de pacotes, scripts e dependências do backend
├── pnpm-lock.yaml # Lockfile do PNPM (ver Observações)
├── README.md # Documentação específica do backend
├── src/ # Código fonte principal do servidor
│ ├── app/ # Lógica de negócio da aplicação (Application Layer)
│ ├── config/ # Configurações do servidor
│ ├── controller/ # Controladores HTTP (Interface Layer)
│ ├── index.ts # Ponto de entrada do servidor
│ ├── infrastructure/ # Implementações de infraestrutura (Infrastructure Layer)
│ ├── interfaces/ # Adapters/Ports para interfaces externas
│ └── shared/ # Código compartilhado
└── tsconfig.json # Configuração TypeScript do backend

#### Arquitetura (Clean / Hexagonal)

O backend segue um padrão de arquitetura que lembra a Clean Architecture ou Hexagonal Architecture, com uma clara separação de responsabilidades em camadas:

- **`app/` (Application Layer):** Contém a lógica de negócio específica da aplicação.
  - `entities/`: Define os objetos de domínio (modelos de dados puros), como `message.entity.ts`.
  - `service/`: Abriga serviços de domínio ou aplicação, como a lógica para interagir com a API Gemini (`gemini.service.ts`).
  - `user-cases/` (ou `use-cases`): Encapsula as regras de negócio específicas de cada funcionalidade ou "caso de uso" da aplicação (`generate-message.ts`). Isso garante que a lógica de negócio seja isolada, testável e reutilizável.
- **`controller/` (Interface Layer):** Responsável por receber requisições HTTP, delegar a execução aos casos de uso apropriados e formatar as respostas. Ex: `chat.controller.ts`.
- **`infrastructure/` (Infrastructure Layer):** Lida com os detalhes de implementação externos à lógica de negócio, como comunicação com banco de dados, Redis, etc.
  - `db/`: Contém os clientes e configurações para as conexões de banco de dados (`client-postgres.ts`, `client-redis.ts`).
  - `drizzle/`: Inclui os schemas do banco de dados definidos pelo Drizzle ORM (`message-schema.ts`) e o histórico de migrações do banco de dados (`migrations/`).
  - `redis/`: Implementa repositórios que abstraem a lógica de acesso ao Redis (`chat.repository.ts`), permitindo que as camadas superiores interajam com os dados sem conhecer os detalhes de armazenamento.
- **`interfaces/` (Interface Adapters / Ports):** Define como a aplicação interage com o mundo exterior.
  - `http/`:
    - `routes/`: Define as rotas da API HTTP (`chat.routes.ts`).
    - `validators/`: Contém a lógica de validação de dados para as requisições HTTP (`message.ts`, `schema.ts`).
- **`config/`:** Arquivos de configuração globais para o servidor (`server.ts`).
- **`shared/`:** Para utilitários ou códigos que podem ser compartilhados entre diferentes partes do backend (`utils/`).

#### Principais Diretórios do `src` - Backend

- `src/index.ts`: O ponto de entrada principal para iniciar o servidor backend.

## 4. Configuração e Instalação

### Pré-requisitos

Para configurar e executar o projeto, você precisará ter instalado:

- **Docker Desktop:** Inclui Docker Engine e Docker Compose ([docs.docker.com/desktop/](https://docs.docker.com/desktop/)).

### Passos para Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/eusouanderson/ChatGemini.git # Substitua pelo seu repositório
    cd ChatGemini
    ```
2.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e dentro das pastas `backend/` e `frontend/` com as variáveis de ambiente necessárias (ex: chaves de API, credenciais de banco de dados). Consulte o código ou exemplos fornecidos no projeto para saber quais variáveis são esperadas.

### Executando a Aplicação

A forma mais recomendada de executar a aplicação em desenvolvimento é usando Docker Compose, que orquestrará tanto o backend quanto os serviços de banco de dados/cache.

1.  **Inicie os serviços com Docker Compose (na raiz do projeto):**

    ```bash
    docker compose --env-file ./backend/.env up --build -d
    ```

    Isso construirá as imagens Docker (se necessário) e iniciará os containers para o backend, PostgreSQL e Redis em segundo plano, usando o arquivo `.env` do backend.

2.  **Inicie o Frontend (em uma nova janela do terminal, dentro de `frontend/`):**

    ```bash
    cd frontend
    bun install
    bun run dev
    ```

    O frontend será iniciado e geralmente estará acessível em `http://localhost:5173` (ou a porta configurada no `vite.config.ts`).

3.  **Inicie o Backend (se não usar Docker Compose para desenvolvimento direto, dentro de `backend/`):**
    ```bash
    cd backend
    bun install
    bun run dev # ou o script de desenvolvimento definido no package.json
    ```
    _(Geralmente, você usaria o Docker Compose para o backend, mas esta é a alternativa se desejar executar o backend Bun nativamente, garantindo que PostgreSQL e Redis estejam acessíveis.)_

## 5. Fluxo de Desenvolvimento

### Testes

- **Frontend:**
  - Executar verificações de tipo: `cd frontend && bun run type-check`
  - Testes unitários/componentes: (Assumindo scripts em `package.json`, ex: `bun test` se configurado)
- **Backend:**
  - Testes com Bun: `cd backend && bun test`

### Testando APIs com `client.http`

O arquivo `backend/client.http` é uma ferramenta conveniente para testar os endpoints da API do backend diretamente de editores de código como VS Code (com a extensão REST Client). Ele permite enviar requisições HTTP e visualizar as respostas, acelerando o desenvolvimento e depuração da API.

## 6. Observações e Considerações Futuras

Durante a análise da estrutura, algumas observações foram feitas:

- **Versões "Cutting Edge":** O projeto utiliza versões beta/alpha de algumas bibliotecas chave (Vue 3.5.x, Pinia 3.x, Tailwind CSS v4).
  - **Vantagem:** Acesso a recursos mais recentes e melhorias de performance.
  - **Desvantagem:** Pode haver maior instabilidade, bugs não documentados e potenciais breaking changes em futuras atualizações.
  - **Sugestão:** Esteja ciente desses riscos, especialmente para produção. Considere fixar versões específicas ou migrar para versões estáveis quando disponíveis, se a estabilidade for uma prioridade maior.
- **Inconsistência de Lockfiles (`pnpm-lock.yaml`):** O arquivo `pnpm-lock.yaml` foi notado tanto no `backend/` quanto no `frontend/` ao lado do `bun.lock`.
  - **Sugestão:** Se o Bun é o gerenciador de pacotes principal e único, o `pnpm-lock.yaml` deve ser removido e adicionado ao `.gitignore` para evitar confusão e garantir que apenas um gerenciador de pacotes seja usado por subprojeto. Se há um monorepo PNPM na raiz, a estrutura precisa ser explicitada.
- **Typos em Nomes de Diretório (Backend):**
  - `src/app/user-cases/`: Geralmente nomeado `use-cases/`.
  - `src/infrastructure/`: Correto seria `infrastructure/`.
  - **Sugestão:** Renomear esses diretórios para padronização e clareza.
- **Duplicação de `ChatMessage.vue` (Frontend):** O componente `ChatMessage.vue` aparece listado em `src/components/atoms/` e `src/components/molecules/`.
  - **Sugestão:** Se são componentes diferentes, renomeie um deles para evitar ambiguidade (ex: `ChatMessageAtom.vue` e `ChatMessageMolecule.vue`, ou mais semanticamente, `MessageText.vue` e `FullChatMessage.vue`). Se for um erro de listagem, corrija a estrutura.
- **Pastas Vazias:** `src/components/models/` (frontend) e `src/shared/utils/` (backend) foram notadas como vazias.
  - **Sugestão:** Se não houver planos imediatos para seu uso, podem ser removidas para manter a estrutura limpa e evitar confusão.

## 7. Contribuindo

(Seções para instruções sobre como contribuir para o projeto, como levantar issues, criar pull requests, etc.)

## 8. Licença

(Seção para a licença do projeto, ex: MIT, Apache 2.0, etc.)

## 9. Contato

Para quaisquer dúvidas ou informações adicionais, entre em contato com Anderson.

---
