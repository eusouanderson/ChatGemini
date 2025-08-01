import { generateMessageUseCase } from '@/app/user-cases/generate-message';
import { messageValidator } from '@/interfaces/http/validators/message';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const chatController = {
  async generate(request: FastifyRequest, reply: FastifyReply) {
    const result = messageValidator.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ errors: result.error.flatten() });
    }

    const message = await generateMessageUseCase(result.data);

    return reply.send(message);
  },
};
