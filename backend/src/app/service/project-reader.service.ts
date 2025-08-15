import { env } from '@/config/env';
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
    '**/.env*',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.{png,jpg,jpeg,gif,svg,ico,webp,avif,mp4,mov,zip}',
  ];

  public async getProjectContentInChunks(projectRelativePath: string): Promise<string[]> {
    console.log(`🔎 Iniciando a leitura do projeto em: ${projectRelativePath}`);

    const absoluteProjectPath = this._validateAndResolvePath(projectRelativePath);

    const files = await this._findProjectFiles(absoluteProjectPath);
    if (files.length === 0) {
      throw new Error('Nenhum arquivo relevante encontrado no diretório especificado.');
    }
    console.log(`  - ${files.length} arquivos encontrados. Lendo conteúdo...`);

    const validFiles = await this._readAllFiles(absoluteProjectPath, files);
    console.log('✅ Leitura de arquivos concluída. Montando lotes (chunks)...');

    const chunks = this._assembleChunks(validFiles);

    console.log(
      `✅ Processamento concluído. ${validFiles.length} arquivos processados e divididos em ${chunks.length} lote(s).`
    );
    return chunks;
  }

  private _validateAndResolvePath(projectRelativePath: string): string {
    const secureBaseDir = path.resolve(env.PROJECTS_BASE_DIR);
    const absoluteProjectPath = path.resolve(secureBaseDir, projectRelativePath);

    // 🔎 Log para depuração
    console.log('🛠️ Debug _validateAndResolvePath');
    console.log('  PROJECTS_BASE_DIR (secureBaseDir):', secureBaseDir);
    console.log('  Caminho recebido (projectRelativePath):', projectRelativePath);
    console.log('  Caminho absoluto resolvido (absoluteProjectPath):', absoluteProjectPath);

    if (!absoluteProjectPath.startsWith(secureBaseDir)) {
      throw new Error(
        'Acesso negado: tentativa de acessar um caminho fora do diretório permitido.'
      );
    }
    return absoluteProjectPath;
  }

  private async _findProjectFiles(projectPath: string): Promise<string[]> {
    return glob('**/*', {
      cwd: projectPath,
      ignore: ProjectReaderService.IGNORE_PATTERNS,
      nodir: true,
      dot: true,
    });
  }

  private async _readAllFiles(
    projectPath: string,
    files: string[]
  ): Promise<{ file: string; content: string }[]> {
    const fileContentsPromises = files.map(async (file) => {
      const filePath = path.join(projectPath, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        console.log(`  - Lendo arquivo: ${file}`);
        return { file, content };
      } catch {
        console.warn(`  - Aviso: Não foi possível ler o arquivo ${file}. Pulando.`);
        return null;
      }
    });

    const results = await Promise.all(fileContentsPromises);
    return results.filter(Boolean) as { file: string; content: string }[];
  }

  private _assembleChunks(filesContent: { file: string; content: string }[]): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    for (const { file, content } of filesContent) {
      const fileEntry = `--- FILE: ${file} ---\n${content}\n--- END FILE ---\n\n`;

      if (fileEntry.length > env.MAX_CHUNK_SIZE_IN_CHARS) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
        for (let i = 0; i < fileEntry.length; i += env.MAX_CHUNK_SIZE_IN_CHARS) {
          chunks.push(fileEntry.substring(i, i + env.MAX_CHUNK_SIZE_IN_CHARS));
        }
      } else {
        if (currentChunk.length + fileEntry.length > env.MAX_CHUNK_SIZE_IN_CHARS) {
          chunks.push(currentChunk);
          currentChunk = fileEntry;
        } else {
          currentChunk += fileEntry;
        }
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }
}
