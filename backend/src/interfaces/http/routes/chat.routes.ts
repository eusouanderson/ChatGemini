import { chatController } from '@/controller/chat.controller';
import type { FastifyInstance } from 'fastify';

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/chat', chatController.generate);
}
