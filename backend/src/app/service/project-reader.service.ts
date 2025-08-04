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

  // limite de caracteres por chunk.

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

    const chunks: string[] = [];
    let currentChunk = '';
    let processedFileCount = 0;

    for (const file of files) {
      const filePath = path.join(projectPath, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        console.log(`  - Lendo arquivo: ${file}`);

        const fileEntry = `--- FILE: ${file} ---\n${content}\n--- END FILE ---\n\n`;

        if (currentChunk.length + fileEntry.length > ProjectReaderService.MAX_CHUNK_SIZE_IN_CHARS) {
          if (currentChunk.length > 0) {
            chunks.push(currentChunk);
          }

          currentChunk = fileEntry;
        } else {
          currentChunk += fileEntry;
        }
        processedFileCount++;
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.warn(
            `  - Aviso: Arquivo ${file} não encontrado. Pode ter sido removido durante a execução.`
          );
        } else {
          console.warn(
            `  - Aviso: Não foi possível ler o arquivo ${file} (provavelmente não é um texto). Pulando.`
          );
        }
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    console.log(
      `✅ Leitura concluída. ${processedFileCount} arquivos processados e divididos em ${chunks.length} lote(s).`
    );
    return chunks;
  }
}
