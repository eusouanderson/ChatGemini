# frontend/Dockerfile

FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 5173

CMD ["sh", "-c", "bun run migrate:up && bun run dev"]

