# chatgemini

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Passos para o Dev

mkdir -p .volumes/postgres
mkdir -p .volumes/redis

docker-compose up -d postgres redis

```bash
src/
├── app/
│   ├── services/
│   │   └── chat.service.ts
│   ├── use-cases/
│   │   └── generate-message.ts
│   └── entities/
│       └── message.entity.ts
│
├── infrastructure/
│   ├── db/
│   │   ├── drizzle/
│   │   │   └── schema.ts
│   │   ├── postgres.ts
│   │   └── redis.ts
│   └── redis/
│       └── chat.repository.ts
│
├── interfaces/
│   └── http/
│       ├── controllers/
│       │   └── chat.controller.ts
│       ├── routes/
│       │   └── chat.routes.ts
│       └── validators/
│           └── message.schema.ts
│
├── shared/
│   ├── config/
│   │   ├── env.ts
│   │   └── logger.ts
│   └── utils/
│       └── string-utils.ts
│
├── index.ts
└── server.ts
```

node node_modules/.bin/drizzle-kit studio

bun run analyze:project /home/eusouanderson/Projetos/ChatGemini
