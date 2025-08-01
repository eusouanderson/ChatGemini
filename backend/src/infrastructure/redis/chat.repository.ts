import { Message } from '@/app/entities/message.entity';
import { redis } from '@/infrastructure/db/client-redis';

const getChatKey = (sessionId: string) => `chat:${sessionId}`;
const HISTORY_EXPIRATION_SECONDS = 60 * 6000;
const MAX_HISTORY_MESSAGES = 1000;

export const chatRepository = {
  async save(sessionId: string, message: Message) {
    const key = getChatKey(sessionId);

    await redis.rpush(key, JSON.stringify(message));
    await redis.ltrim(key, -MAX_HISTORY_MESSAGES, -1);
    await redis.expire(key, HISTORY_EXPIRATION_SECONDS);
  },

  async getAll(sessionId: string): Promise<Message[]> {
    const key = getChatKey(sessionId);
    const rawList = await redis.lrange(key, 0, -1);
    return rawList
      .map((item) => {
        try {
          return JSON.parse(item) as Message;
        } catch (err) {
          console.error('Erro ao parsear mensagem do Redis:', err);
          return null;
        }
      })
      .filter(Boolean) as Message[];
  },

  async clear(sessionId: string) {
    const key = getChatKey(sessionId);
    await redis.del(key);
  },
};
