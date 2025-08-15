import type { Message } from '@/app/entities/message.entity';
import { callGeminiAPI } from '@/app/service/gemini.service';
import { ProjectReaderService } from '@/app/service/project-reader.service';
import { chatRepository } from '@/infrastructure/redis/chat.repository';
import { v4 as uuidv4 } from 'uuid';

function formatHistoryForPrompt(history: Message[]): string {
  if (history.length === 0) {
    return 'Nenhum histórico de conversa anterior.';
  }
  return history
    .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
    .join('\n');
}

function createChunkAnalysisPrompt(
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  history: string
): string {
  return `
# ROLE
Você é um Engenheiro de Software Sênior.

# CONTEXT
A análise será feita diretamente nos arquivos do projeto, **mas qualquer arquivo contendo dados sensíveis (ex.: .env, credenciais, chaves privadas) deve ser totalmente ignorado na avaliação**.  
Caso esses arquivos apareçam, não os classifique como falha de segurança — considere-os apenas como conteúdo não analisável.  

Você está analisando um grande projeto de software em partes. Você recebeu o LOTE ${chunkIndex} de ${totalChunks}.
Sua análise preliminar será usada posteriormente para gerar um relatório consolidado.
Abaixo está o histórico da conversa atual para lhe dar contexto sobre o que o usuário pode ter pedido anteriormente.

# HISTÓRICO DA CONVERSA
${history}

# TASK
Analise o lote de código abaixo. Foque em identificar:
- Padrões de arquitetura e design.
- Pontos críticos de qualidade de código (complexidade, duplicação, etc.).
- Possíveis falhas de segurança.
- Ausência ou presença de testes.
- Qualidade da documentação (comentários, READMEs).

Seja conciso e direto. Liste suas observações em formato de tópicos (markdown).

# CODE CHUNK
${chunk}
`;
}

function createFinalReportPrompt(allSummaries: string, history: string): string {
  return `
# ROLE
Você é o CodeReviewer AI, um Arquiteto de Soluções Sênior com 15 anos de experiência.

# CONTEXT
Você recebeu um conjunto de análises preliminares (sumários) de um projeto de software.
Abaixo está o histórico da conversa com o usuário, que pode conter instruções ou focos específicos para a análise.

# HISTÓRICO DA CONVERSA
${history}

# TASK
Sua tarefa é sintetizar esses sumários em um único relatório final e abrangente.
Com base nas informações dos sumários e no contexto da conversa, preencha o JSON abaixo com pontuações, justificativas técnicas e sugestões práticas.
Calcule o "overallScore" como uma média ponderada das outras pontuações.

# OUTPUT FORMAT
Responda APENAS em formato JSON, seguindo estritamente a estrutura abaixo. Não inclua nenhuma outra explicação fora do JSON.

{
  "projectName": "Análise de Projeto",
  "overallScore": 0.0,
  "summary": "Um resumo executivo conciso da saúde geral do projeto, baseado nas análises.",
  "analysis": {
    "codeQuality": { "score": 0, "justification": "...", "suggestions": [] },
    "architectureAndDesign": { "score": 0, "justification": "...", "suggestions": [] },
    "security": { "score": 0, "justification": "...", "suggestions": [] },
    "testing": { "score": 0, "justification": "...", "suggestions": [] },
    "documentation": { "score": 0, "justification": "...", "suggestions": [] }
  }
}

# SUMMARIES FROM PROJECT CHUNKS
${allSummaries}
`;
}

export interface AnalyzeProjectInput {
  projectPath: string;
  sessionId?: string;
}

export async function analyzeProjectUseCase(input: AnalyzeProjectInput): Promise<any> {
  const { projectPath, sessionId } = input;

  try {
    const conversationHistory = sessionId ? await chatRepository.getAll(sessionId) : [];
    const formattedHistory = formatHistoryForPrompt(conversationHistory);

    const reader = new ProjectReaderService();
    const projectChunks = await reader.getProjectContentInChunks(projectPath);
    const totalChunks = projectChunks.length;

    const chunkAnalyses: string[] = [];

    console.log(`\n🤖 Iniciando análise preliminar de ${totalChunks} lote(s) do projeto...`);

    for (const [index, chunk] of projectChunks.entries()) {
      console.log(`  - Analisando lote ${index + 1} de ${totalChunks}...`);

      const chunkPrompt = createChunkAnalysisPrompt(
        chunk,
        index + 1,
        totalChunks,
        formattedHistory
      );

      const preliminaryAnalysis = await callGeminiAPI(chunkPrompt);

      // Salva a análise preliminar como mensagem da IA
      if (sessionId) {
        await chatRepository.save(sessionId, {
          id: uuidv4(),
          role: 'assistant',
          content: `--- ANÁLISE DO LOTE ${index + 1}/${totalChunks} ---\n${preliminaryAnalysis}`,
          timestamp: Date.now(),
        });
      }

      chunkAnalyses.push(
        `--- ANÁLISE DO LOTE ${index + 1}/${totalChunks} ---\n${preliminaryAnalysis}`
      );
    }

    console.log('\n✅ Análises preliminares concluídas.');
    console.log('🤖 Sintetizando o relatório final...');

    const allSummaries = chunkAnalyses.join('\n\n');
    const finalReportPrompt = createFinalReportPrompt(allSummaries, formattedHistory);

    const finalReportRaw = await callGeminiAPI(finalReportPrompt);

    // Salva o relatório final como mensagem da IA
    if (sessionId) {
      await chatRepository.save(sessionId, {
        id: uuidv4(),
        role: 'assistant',
        content: `--- RELATÓRIO FINAL ---\n${finalReportRaw}`,
        timestamp: Date.now(),
      });
    }

    try {
      const jsonMatch = finalReportRaw.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : finalReportRaw;

      const jsonResponse = JSON.parse(jsonString ?? '{}');
      return jsonResponse;
    } catch (e) {
      console.error(
        'Erro ao parsear a resposta JSON final da IA. Retornando a resposta em texto bruto.'
      );
      console.error('Detalhes do erro:', e);
      return { rawResponse: finalReportRaw };
    }
  } catch (error) {
    console.error('[analyzeProjectUseCase] Erro:', error);
    throw new Error('Erro ao analisar o projeto.');
  }
}
