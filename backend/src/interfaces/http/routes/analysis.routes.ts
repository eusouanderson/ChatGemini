import { Request, Response, Router } from 'express';
import { ZodError } from 'zod';

import { analyzeProjectUseCase } from '@/app/user-cases/analyze-project';
import { analysisRequestSchema } from '@/infrastructure/db/drizzle/message-schema';

const analysisRouter = Router();

analysisRouter.get('/analyze', (req: Request, res: Response) => {
  try {
    const { path } = analysisRequestSchema.parse({ path: req.query.path });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (eventName: string, data: any) => {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    console.log(`[SSE] Conexão iniciada para análise do projeto: ${path}`);
    analyzeProjectUseCase(path, sendEvent).finally(() => {
      console.log(`[SSE] Conexão encerrada para: ${path}`);
      res.end();
    });

    req.on('close', () => {
      console.log(`[SSE] Cliente desconectou. Encerrando análise para: ${path}`);
      res.end();
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'O caminho do projeto fornecido é inválido.',
        errors: error.flatten().fieldErrors,
      });
    }

    // Outros erros inesperados
    console.error('[Endpoint /analyze] Erro inesperado:', error);
    return res.status(500).json({
      message: 'Ocorreu um erro interno no servidor.',
    });
  }
});

export { analysisRouter };
