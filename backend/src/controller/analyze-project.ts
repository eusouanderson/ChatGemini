import { analyzeProjectUseCase } from '@/app/user-cases/analyze-project';
import chalk from 'chalk';
import path from 'path';

function displayReport(report: any) {
  if (report.rawResponse) {
    console.log(chalk.yellow('\n--- Resposta Bruta da IA ---'));
    console.log(report.rawResponse);
    return;
  }

  console.log(chalk.cyan.bold('\n--- Relatório de Análise do Projeto ---'));
  console.log(chalk.bold(`Projeto: `) + chalk.white(report.projectName));
  console.log(chalk.bold(`Pontuação Geral: `) + chalk.yellow.bold(report.overallScore));
  console.log(chalk.bold(`Resumo: `) + chalk.white(report.summary));
  console.log(chalk.cyan('----------------------------------------\n'));

  for (const [key, value] of Object.entries(report.analysis)) {
    const details = value as { score: number; justification: string; suggestions: string[] };
    console.log(chalk.magenta.bold.underline(key.replace(/([A-Z])/g, ' $1').toUpperCase()));
    console.log(chalk.bold(`  Pontuação: `) + chalk.yellow(details.score + '/10'));
    console.log(chalk.bold(`  Justificativa: `) + chalk.white(details.justification));
    if (details.suggestions && details.suggestions.length > 0) {
      console.log(chalk.bold(`  Sugestões:`));
      details.suggestions.forEach((s) => console.log(chalk.green(`    - ${s}`)));
    }
    console.log('\n');
  }
}

async function main() {
  const projectArg = process.argv[2];
  if (!projectArg) {
    console.error(chalk.red('Erro: Por favor, forneça o caminho para o projeto.'));
    console.log(chalk.yellow('Exemplo: bun run analyze-project ../Caminho/Para/O/Projeto'));
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), projectArg);

  try {
    const report = await analyzeProjectUseCase(projectPath);
    displayReport(report);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\nFalha na análise: ${error.message}`));
    } else {
      console.error(chalk.red('\nOcorreu um erro desconhecido.'));
    }
    process.exit(1);
  }
}

main();
