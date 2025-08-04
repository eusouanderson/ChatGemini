import { callGeminiAPI } from '@/app/service/gemini.service';
import { ProjectReaderService } from '@/app/service/project-reader.service';

function createChunkAnalysisPrompt(chunk: string, chunkIndex: number, totalChunks: number): string {
  return `
# ROLE
Você é um Engenheiro de Software Sênior.

# CONTEXT
Você está analisando um grande projeto de software em partes. Você recebeu o LOTE ${chunkIndex} de ${totalChunks}. Sua análise preliminar será usada posteriormente para gerar um relatório consolidado.

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

function createFinalReportPrompt(allSummaries: string): string {
  return `
# ROLE
Você é o CodeReviewer AI, um Arquiteto de Soluções Sênior com 15 anos de experiência.

# CONTEXT
Você recebeu um conjunto de análises preliminares (sumários) de um projeto de software, que foi dividido em várias partes.

# TASK
Sua tarefa é sintetizar esses sumários em um único relatório final e abrangente. Com base nas informações fornecidas, preencha o JSON abaixo com pontuações, justificativas técnicas e sugestões práticas. Calcule o "overallScore" como uma média ponderada das outras pontuações.

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

export async function analyzeProjectUseCase(projectPath: string): Promise<any> {
  try {
    const reader = new ProjectReaderService();
    const projectChunks = await reader.getProjectContentInChunks(projectPath);
    const totalChunks = projectChunks.length;

    const chunkAnalyses: string[] = [];

    console.log(`\n🤖 Iniciando análise preliminar de ${totalChunks} lote(s) do projeto...`);

    for (const [index, chunk] of projectChunks.entries()) {
      console.log(`  - Analisando lote ${index + 1} de ${totalChunks}...`);
      const chunkPrompt = createChunkAnalysisPrompt(chunk, index + 1, totalChunks);
      const preliminaryAnalysis = await callGeminiAPI(chunkPrompt);
      chunkAnalyses.push(
        `--- ANÁLISE DO LOTE ${index + 1}/${totalChunks} ---\n${preliminaryAnalysis}`
      );
    }

    console.log('\n✅ Análises preliminares concluídas.');
    console.log('🤖 Sintetizando o relatório final...');

    const allSummaries = chunkAnalyses.join('\n\n');
    const finalReportPrompt = createFinalReportPrompt(allSummaries);

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
      return { rawResponse: finalReportRaw };
    }
  } catch (error) {
    console.error('[analyzeProjectUseCase] Erro:', error);
    throw new Error('Erro ao analisar o projeto.');
  }
}
