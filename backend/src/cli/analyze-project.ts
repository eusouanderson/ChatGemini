import type { Message } from '@/app/entities/message.entity'; // <-- ADICIONAR IMPORT
import { callGeminiAPI } from '@/app/service/gemini.service';
import { ProjectReaderService } from '@/app/service/project-reader.service';
import { chatRepository } from '@/infrastructure/redis/chat.repository'; // <-- ADICIONAR IMPORT

// ---
// 1. ALTERAÇÃO: Adicionar o histórico da conversa ao prompt de análise
// ---

// Função auxiliar para evitar duplicação de código na formatação do histórico
function formatHistoryForPrompt(history: Message[]): string {
  if (history.length === 0) {
    return 'Nenhum histórico de conversa anterior.';
  }
  return history
    .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
    .join('\n');
}

// ALTERADO: A função agora recebe o histórico como parâmetro
function createChunkAnalysisPrompt(
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  history: string // NOVO: parâmetro para o histórico formatado
): string {
  return `
# ROLE
Você é um Engenheiro de Software Sênior.

# CONTEXT
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

// ALTERADO: Adicionando histórico também ao relatório final para consistência
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

// ---
// 2. ALTERAÇÃO: Atualizar o use case principal para usar o sessionId
// ---

// NOVO: Interface para os parâmetros de entrada
interface AnalyzeProjectInput {
  projectPath: string;
  sessionId?: string;
}

// ALTERADO: A função agora recebe um objeto de input
export async function analyzeProjectUseCase(input: AnalyzeProjectInput): Promise<any> {
  const { projectPath, sessionId } = input; // <-- Desestruturação dos parâmetros

  try {
    // NOVO: Busca o histórico da conversa usando o sessionId
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
      chunkAnalyses.push(
        `--- ANÁLISE DO LOTE ${index + 1}/${totalChunks} ---\n${preliminaryAnalysis}`
      );
    }

    console.log('\n✅ Análises preliminares concluídas.');
    console.log('🤖 Sintetizando o relatório final...');

    const allSummaries = chunkAnalyses.join('\n\n');
    // ALTERADO: Passa o histórico também para o prompt final
    const finalReportPrompt = createFinalReportPrompt(allSummaries, formattedHistory);

    const finalReportRaw = await callGeminiAPI(finalReportPrompt);
    console.log('✅ Relatório final recebido da IA!');

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
