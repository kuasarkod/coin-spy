#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import registerCommands from '../src/commands/index.js';
import { logger } from '../src/utils/logger.js';

const program = new Command();

const banner = figlet.textSync('CRYPTO TRACKER', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
});

console.log(chalk.cyan(banner));
console.log(chalk.yellow('Coded by ') + chalk.bold.yellow('kuasarkod') + chalk.yellow(' | Discord: ') + chalk.bold.yellow('kuasarkod'));
console.log('');

program
  .name('crypto')
  .description('Professional CLI cryptocurrency tracker powered by CoinGecko API')
  .version('1.0.0');

registerCommands(program);

program.configureHelp({
  sortSubcommands: true,
  sortOptions: true
});

program.on('command:*', () => {
  logger.error(`Unknown command: ${program.args.join(' ')}`);
  program.help({ error: true });
});

program.parseAsync(process.argv).catch((error) => {
  logger.error(error.message || 'Unexpected error occurred.');
  process.exitCode = 1;
});
