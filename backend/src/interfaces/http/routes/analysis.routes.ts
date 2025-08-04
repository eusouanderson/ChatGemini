import { analyzeProjectUseCase } from '@/app/user-cases/analyze-project';
import { FastifyInstance } from 'fastify';

export async function analysisRoutes(app: FastifyInstance) {
  app.post('/analyze', async (request, reply) => {
    const body = request.body as { projectPath?: string };

    if (!body?.projectPath) {
      return reply.status(400).send({ error: 'O campo projectPath é obrigatório.' });
    }

    try {
      const result = await analyzeProjectUseCase(body.projectPath);
      return reply.send(result);
    } catch (error: any) {
      // Log completo para facilitar o debug
      app.log.error(error);

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
