import { analysisRoutes } from '@/interfaces/http/routes/analysis.routes';
import { chatRoutes } from '@/interfaces/http/routes/chat.routes';
import cors from '@fastify/cors';
import Fastify from 'fastify';

export const buildServer = async () => {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  });

  fastify.register(
    async (instance) => {
      instance.get('/', async () => {
        return { message: 'API está no ar 🚀' };
      });
    },
    { prefix: '/api' }
  );

  await fastify.register(analysisRoutes, { prefix: '/api' });
  await fastify.register(chatRoutes, { prefix: '/api' });

  return fastify;
};
