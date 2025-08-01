import { Message } from '@/app/entities/message.entity';
import { callGeminiAPI } from '@/app/service/gemini.service';
import { db } from '@/infrastructure/db/client-postgres';
import { messageSchema as messages } from '@/infrastructure/db/drizzle/message-schema';
import { chatRepository } from '@/infrastructure/redis/chat.repository';
import type { MessageInput } from '@/interfaces/http/validators/message';

interface GenerateMessageInput extends MessageInput {
  sessionId?: string;
}

function createSystemPrompt(): string {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  return `
  Você é Super Gemini, um assistente de programação para desenvolvedores.
  Seu foco é ajudar com dúvidas sobre código, boas práticas, ferramentas modernas e otimizações em projetos de software.
  - Responda de forma objetiva, clara e sempre que possível com exemplos práticos e explicações técnicas.
  - Utilize uma linguagem profissional, porém acessível.
  - Quando necessário, sugira referências ou ferramentas úteis.
  - Caso a dúvida seja muito genérica ou sem contexto suficiente, solicite mais informações antes de responder.
  - Não invente respostas. Se não souber ou for incerto, diga isso de forma honesta.
  A data de hoje é ${currentDate}.
`;
}

function buildPromptFromHistory(history: Message[], newUserContent: string): any[] {
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  formattedHistory.push({
    role: 'user',
    parts: [{ text: newUserContent }],
  });

  return formattedHistory;
}

export async function generateMessageUseCase(input: GenerateMessageInput): Promise<Message> {
  const { content, sessionId } = input;

  try {
    const userMessage = new Message('user', content);

    if (sessionId) {
      await chatRepository.save(sessionId, userMessage);
    }

    const allHistory = sessionId ? await chatRepository.getAll(sessionId) : [];
    const recentHistory = allHistory.slice(-100);

    const systemPrompt = createSystemPrompt();
    const conversationHistory = buildPromptFromHistory(recentHistory, content);

    const promptForOldAPI =
      `${systemPrompt}\n\n--- Histórico da Conversa ---\n` +
      conversationHistory
        .map((msg) => `${msg.role === 'model' ? 'Assistant' : 'User'}: ${msg.parts[0].text}`)
        .join('\n');

    const geminiResponse = await callGeminiAPI(promptForOldAPI);

    const assistantMessage = new Message('assistant', geminiResponse);

    if (sessionId) {
      await chatRepository.save(sessionId, assistantMessage);
    }

    await db.insert(messages).values({
      role: assistantMessage.role,
      content: assistantMessage.content,
      timestamp: assistantMessage.timestamp,

      tokensUsed: geminiResponse.length,
    });

    return assistantMessage;
  } catch (error) {
    console.error('[generateMessageUseCase] Erro:', error);
    throw new Error('Erro ao gerar mensagem');
  }
}
