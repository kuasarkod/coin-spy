import path from 'path';
import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { storage } from '../utils/storage.js';
import { withSpinner } from '../utils/spinner.js';
import { resolveCurrency } from '../utils/preferences.js';
import { ensureDir, writeFile } from '../utils/file.js';
import { logger } from '../utils/logger.js';

const escapeCsv = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('\"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildCsv = (coins, currency) => {
  const header = ['Rank', 'Name', 'Symbol', `Price (${currency.toUpperCase()})`, '24h Change (%)', 'Market Cap', 'Volume'];
  const rows = coins.map((coin) => [
    coin.market_cap_rank ?? '',
    coin.name ?? '',
    coin.symbol?.toUpperCase() ?? '',
    coin.current_price ?? '',
    coin.price_change_percentage_24h ?? '',
    coin.market_cap ?? '',
    coin.total_volume ?? ''
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');
};

export default function registerExportCommand(program) {
  program
    .command('export')
    .description('Export favorite coins to CSV')
    .option('-c, --currency <currency>', 'Currency to display values', 'usd')
    .option('-o, --output <file>', 'Output CSV file path')
    .action(async (options) => {
      const favorites = storage.getFavorites();
      if (!favorites.length) {
        logger.info(chalk.blue('No favorite coins to export. Use "crypto add <coin-id>" first.'));
        return;
      }

      const currency = resolveCurrency(options.currency);
      const coins = await withSpinner('Fetching favorite coins...', async () => {
        const data = await coingeckoService.getMarkets({
          vs_currency: currency,
          ids: favorites
        });
        return Array.isArray(data) ? data : [];
      });

      if (!coins.length) {
        logger.warn('No data available to export.');
        return;
      }

      const csv = buildCsv(coins, currency);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = options.output
        ? path.resolve(process.cwd(), options.output)
        : path.resolve(process.cwd(), 'exports', `favorites-${timestamp}.csv`);

      await ensureDir(path.dirname(outputPath));
      await writeFile(outputPath, csv);

      logger.success(chalk.green(`Exported ${coins.length} coins to ${outputPath}`));
    });
}
