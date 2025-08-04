import { analyzeProjectUseCase } from '@/cli/analyze-project';
import { FastifyInstance } from 'fastify';

export async function analysisRoutes(app: FastifyInstance) {
  app.post('/analyze', async (request, reply) => {
    // 1. ATUALIZAÇÃO: Extrair também o sessionId do corpo da requisição.
    const body = request.body as { projectPath?: string; sessionId?: string };

    if (!body?.projectPath) {
      return reply.status(400).send({ error: 'O campo projectPath é obrigatório.' });
    }

    try {
      // 2. CORREÇÃO: Chamar o use case passando um objeto como argumento.
      const result = await analyzeProjectUseCase({
        projectPath: body.projectPath,
        sessionId: body.sessionId,
      });

      return reply.send(result);
    } catch (error: any) {
      app.log.error(error, 'Erro durante a execução de analyzeProjectUseCase');

      if (error.message?.includes('Nenhum arquivo relevante encontrado')) {
        return reply
          .status(404)
          .send({ error: 'Nenhum arquivo relevante encontrado no diretório especificado.' });
      }

      // Outros erros inesperados
      return reply.status(500).send({ error: 'Erro ao analisar o projeto.' });
    }
  });
}
