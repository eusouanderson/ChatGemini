import fs from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

export class ProjectReaderService {
  private static IGNORE_PATTERNS = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/*.lock',
    '**/*.log',
    '**/coverage/**',
    '**/vendor/**',
    '**/tmp/**',
    '**/temp/**',
    '**/cache/**',
    '**/public/**',
    '**/static/**',
    '**/.env.*',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.{png,jpg,jpeg,gif,svg,ico,webp,avif,mp4,mov,zip}',
  ];

  private static MAX_CHUNK_SIZE_IN_CHARS = 800_000;

  public async getProjectContentInChunks(projectPath: string): Promise<string[]> {
    console.log(`🔎 Iniciando a leitura do projeto em: ${projectPath}`);

    const files = await glob('**/*', {
      cwd: projectPath,
      ignore: ProjectReaderService.IGNORE_PATTERNS,
      nodir: true,
      dot: true,
    });

    if (files.length === 0) {
      throw new Error('Nenhum arquivo relevante encontrado no diretório especificado.');
    }

    console.log(`  - ${files.length} arquivos encontrados. Lendo conteúdo em paralelo...`);

    // --- OTIMIZAÇÃO 1: Leitura de arquivos em paralelo ---
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(projectPath, file);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          console.log(`  - Lendo arquivo: ${file}`);
          return { file, content };
        } catch (error: any) {
          // Ignora erros de leitura (ex: arquivos binários) e retorna null
          console.warn(`  - Aviso: Não foi possível ler o arquivo ${file}. Pulando.`);
          return null;
        }
      })
    );

    console.log('✅ Leitura de arquivos concluída. Montando lotes (chunks)...');

    // --- OTIMIZAÇÃO 2: Lógica de chunking robusta ---
    const chunks: string[] = [];
    let currentChunk = '';
    let processedFileCount = 0;

    // Filtra os arquivos que não puderam ser lidos
    const validFiles = fileContents.filter(Boolean) as { file: string; content: string }[];

    for (const { file, content } of validFiles) {
      const fileEntry = `--- FILE: ${file} ---\n${content}\n--- END FILE ---\n\n`;

      // Se o arquivo sozinho já estoura o limite, ele precisa ser quebrado
      if (fileEntry.length > ProjectReaderService.MAX_CHUNK_SIZE_IN_CHARS) {
        // Primeiro, adiciona o chunk atual (se houver) para não misturar conteúdos
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = '';
        }

        // Quebra o conteúdo do arquivo grande em pedaços
        for (let i = 0; i < fileEntry.length; i += ProjectReaderService.MAX_CHUNK_SIZE_IN_CHARS) {
          const part = fileEntry.substring(i, i + ProjectReaderService.MAX_CHUNK_SIZE_IN_CHARS);
          chunks.push(part);
        }
      } else {
        // Se adicionar o arquivo excede o limite, fecha o chunk atual e inicia um novo
        if (currentChunk.length + fileEntry.length > ProjectReaderService.MAX_CHUNK_SIZE_IN_CHARS) {
          chunks.push(currentChunk);
          currentChunk = fileEntry;
        } else {
          currentChunk += fileEntry;
        }
      }
      processedFileCount++;
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    console.log(
      `✅ Processamento concluído. ${processedFileCount} arquivos processados e divididos em ${chunks.length} lote(s).`
    );
    return chunks;
  }
}
