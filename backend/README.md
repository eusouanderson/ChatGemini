# ChatGemini

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.io/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-ORANGE?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)

ChatGemini é um backend para um assistente de programação conversacional, utilizando a API do Google Gemini. O sistema é projetado para manter o contexto de conversas e realizar análises aprofundadas de código em projetos de software.

## Tabela de Conteúdos

- [Principais Funcionalidades](#principais-funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Executando a Aplicação](#executando-a-aplicação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Exemplo de Uso da API](#exemplo-de-uso-da-api)

## Principais Funcionalidades

- **Chat Conversacional:** Interação com a IA mantendo o histórico e contexto da sessão.
- **Análise de Código:** Capacidade de analisar um projeto de software completo, dividindo-o em partes para uma avaliação detalhada e consolidada.
- **Persistência de Sessão:** Uso de Redis para um rápido acesso ao histórico de conversas ativas.
- **Arquitetura Limpa:** Separação clara de responsabilidades entre lógica de negócio, infraestrutura e interface.

## Stack Tecnológico

- **Runtime:** [Bun](https://bun.sh)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [Fastify](https://www.fastify.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Cache de Sessão:** [Redis](https://redis.io/)
- **ORM / Query Builder:** [Drizzle ORM](https://orm.drizzle.team/)
- **Containerização:** [Docker](https://www.docker.com/)

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas em seu sistema:

- [Bun](https://bun.sh/docs/installation) (v1.2.x ou superior)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração e Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

**1. Clone o Repositório**

```bash
git clone github.com/eusouaderson/ChatGemini
cd chatgemini
```

2. Configure as Variáveis de Ambiente

Crie uma cópia do arquivo de exemplo .env.example e renomeie para .env. Em seguida, preencha as variáveis necessárias.

cp .env.example .env
Conteúdo do seu .env.example (crie este arquivo se ele não existir):

# Configurações do Servidor

PORT=3000

# Configurações do Banco de Dados PostgreSQL

DATABASE_URL="postgresql://docker:docker@localhost:5432/chatgemini"

# Configurações do Redis

REDIS_HOST="localhost"
REDIS_PORT=6379

# Chave da API do Google Gemini

GEMINI_API_KEY="SUA_CHAVE_DE_API_AQUI" 3. Instale as Dependências

bun install 4. Inicie os Serviços de Infraestrutura (Banco de Dados e Cache)

Os comandos abaixo criarão os volumes para persistência de dados e iniciarão os contêineres do Postgres e Redis em background.

mkdir -p .volumes/postgres
mkdir -p .volumes/redis
docker-compose up -d 5. Execute as Migrations do Banco de Dados

Aplique o schema mais recente ao seu banco de dados. (Assumindo que você tenha um script para isso).

# Sugestão de script em package.json: "db:migrate": "drizzle-kit push:pg"

bun run db:migrate
Executando a Aplicação
Para iniciar o servidor em modo de desenvolvimento com hot-reload:

# Sugestão de script em package.json: "start:dev": "bun --watch src/server.ts"

bun run start:dev
O servidor estará disponível em http://localhost:3000.

Scripts Disponíveis
Aqui estão alguns comandos úteis que podem ser configurados no seu package.json:

bun run start:dev: Inicia o servidor em modo de desenvolvimento.
bun run db:migrate: Aplica as migrations do Drizzle ao banco de dados.
bun run db:studio: Abre a interface gráfica do Drizzle Studio para visualizar e gerenciar o banco de dados.
bun run analyze:project <caminho>: Executa a análise de um projeto local.
Importante: Substitua <caminho> pelo caminho absoluto do projeto que você deseja analisar. Não use caminhos fixos no código.
Exemplo de uso do script de análise:

bun run analyze:project /home/usuario/projetos/meu-outro-projeto
Estrutura do Projeto
O projeto segue uma arquitetura inspirada na Arquitetura Limpa (Clean Architecture) para garantir a separação de responsabilidades e a manutenibilidade.

src/
├── app/ # Lógica de negócio principal (independente de frameworks)
│ ├── entities/ # Entidades de negócio (ex: Message)
│ ├── services/ # Serviços de domínio (ex: ProjectReaderService)
│ └── use-cases/ # Orquestração das regras de negócio (ex: generateMessage, analyzeProject)
│
├── infrastructure/ # Implementação de detalhes técnicos (bancos, APIs externas)
│ ├── db/ # Configuração do banco, schema Drizzle
│ └── redis/ # Repositórios e clientes Redis
│
├── interfaces/ # Camada de entrada e saída (API, CLI)
│ └── http/ # Relacionado ao protocolo HTTP (Fastify)
│ ├── controllers/ # Controladores que recebem requisições
│ ├── routes/ # Definição das rotas da API
│ └── validators/ # Validação de schemas de entrada (Zod, etc.)
│
├── shared/ # Módulos compartilhados pela aplicação (config, logs, utils)
│
├── index.ts # Ponto de entrada (CLI, se houver)
└── server.ts # Ponto de entrada da aplicação web (servidor Fastify)
Exemplo de Uso da API
Você pode usar cURL ou uma ferramenta como Insomnia/Postman para testar os endpoints.

Analisar um Projeto:

```bash
curl -X POST http://localhost:3000/api/analyze \
-H "Content-Type: application/json" \
-d '{
"projectPath": "/app",
"sessionId": "session-12345"
}'
```
