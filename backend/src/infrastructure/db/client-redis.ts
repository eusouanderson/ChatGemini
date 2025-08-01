import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 5000);
    return delay;
  },
});

export async function testConnectionRedis() {
  try {
    const pong = await redis.ping();
    if (pong !== 'PONG') throw new Error('Resposta inesperada do Redis');
  } catch (error) {
    console.error('❌ Falha na conexão com Redis:', error);
    process.exit(1);
  }
}
