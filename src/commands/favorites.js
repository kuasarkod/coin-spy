import Table from 'cli-table3';
import chalk from 'chalk';
import { storage } from '../utils/storage.js';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatter.js';
import { resolveCurrency } from '../utils/preferences.js';
import { logger } from '../utils/logger.js';

const buildTable = (coins, currency) => {
  const table = new Table({
    head: [
      chalk.blue('Name'),
      chalk.blue('Symbol'),
      chalk.blue('Price'),
      chalk.blue('24h Change'),
      chalk.blue('Market Cap'),
      chalk.blue('Volume')
    ],
    style: { head: [], border: [] }
  });

  coins.forEach((coin) => {
    table.push([
      coin.name,
      coin.symbol.toUpperCase(),
      formatCurrency(coin.current_price, currency),
      formatPercent(coin.price_change_percentage_24h),
      formatNumber(coin.market_cap),
      formatNumber(coin.total_volume)
    ]);
  });

  return table;
};

export default function registerFavoritesCommand(program) {
  program
    .command('favorites')
    .description('Display favorite coins')
    .option('-c, --currency <currency>', 'Currency to display values', 'usd')
    .action(async (options) => {
      const favorites = storage.getFavorites();
      if (!favorites.length) {
        logger.info(chalk.blue('No favorite coins yet. Use "crypto add <coin-id>" to add one.'));
        return;
      }

      const currency = resolveCurrency(options.currency);
      const coins = await withSpinner('Fetching favorites...', async () => {
        const data = await coingeckoService.getMarkets({
          vs_currency: currency,
          ids: favorites
        });
        return Array.isArray(data) ? data : [];
      });

      if (!coins.length) {
        logger.warn('Unable to retrieve favorite coins data.');
        return;
      }

      const table = buildTable(coins, currency);
      console.log(table.toString());
      logger.success(`Listed ${coins.length} favorite coins.`);
    });
}
