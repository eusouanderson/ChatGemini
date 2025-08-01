import { buildServer } from '@/config/server';
import { testConnectionPostgres } from '@/infrastructure/db/client-postgres';
import { testConnectionRedis } from '@/infrastructure/db/client-redis';

const start = async () => {
  try {
    await testConnectionPostgres();
    console.log('✅ Conectado ao PostgreSQL');

    await testConnectionRedis();
    console.log('✅ Conectado ao Redis');

    const server = await buildServer();
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info('🚀 Server running on http://localhost:3000');
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor ou conectar:', err);
    process.exit(1);
  }
};

start();
