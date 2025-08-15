import { analyzeProjectUseCase } from '@/cli/analyze-project';
import type { FastifyInstance } from 'fastify';

export async function analysisRoutes(app: FastifyInstance) {
  app.post('/analyze', async (request, reply) => {
    const body = request.body as { projectPath?: string; sessionId?: string };

    if (!body?.projectPath) {
      return reply.status(400).send({ error: 'O campo projectPath é obrigatório.' });
    }

    try {
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
      return reply.status(500).send({ error: 'Erro ao analisar o projeto.' });
    }
  });
}
