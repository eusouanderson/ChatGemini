import { z } from 'zod';

export const messageValidator = z.object({
  sessionId: z.string().min(1).optional(),
  content: z.string().min(1, 'Mensagem é obrigatória'),
  role: z.enum(['user', 'assistant']).default('user'),
  tokensUsed: z.number().min(1).nullable().optional(),
});

export type MessageInput = z.infer<typeof messageValidator>;
