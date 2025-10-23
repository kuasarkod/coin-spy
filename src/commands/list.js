import Table from 'cli-table3';
import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatter.js';
import { resolveCurrency, resolveSort, updatePreferences } from '../utils/preferences.js';
import { DEFAULT_LIST_COUNT, SUPPORTED_CURRENCIES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

const ensureCurrency = (currency) => {
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    logger.warn(`Unsupported currency "${currency}". Falling back to USD.`);
    return 'usd';
  }
  return currency;
};

const buildTable = (coins, currency) => {
  const table = new Table({
    head: [
      chalk.blue('Rank'),
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
      coin.market_cap_rank ?? '-',
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

export default function registerListCommand(program) {
  program
    .command('list')
    .description('List top cryptocurrencies')
    .option('-n, --number <count>', 'Number of coins to display', (value) => parseInt(value, 10), DEFAULT_LIST_COUNT)
    .option('-c, --currency <currency>', 'Currency (usd, eur, gbp, try)')
    .option('-s, --sort <field>', 'Sort field (market_cap, price, volume, change)', 'market_cap')
    .option('--desc', 'Sort descending order')
    .action(async (options) => {
      const { number, currency, sort, desc } = options;
      const resolvedCurrency = ensureCurrency(resolveCurrency(currency));
      const resolvedSort = resolveSort(sort);

      updatePreferences({ currency: resolvedCurrency, sort: resolvedSort });

      const isDescending = Boolean(desc);
      const order = resolvedSort === 'market_cap' ? (isDescending ? 'market_cap_desc' : 'market_cap_asc') : 'market_cap_desc';

      const coins = await withSpinner('Fetching data...', async () => {
        const data = await coingeckoService.getMarkets({
          vs_currency: resolvedCurrency,
          per_page: Math.min(number, 250),
          order
        });
        return Array.isArray(data) ? data.slice(0, number) : [];
      });

      if (!coins.length) {
        logger.warn('No coins found.');
        return;
      }

      const sortedCoins = coins.sort((a, b) => {
        const direction = isDescending ? -1 : 1;
        switch (resolvedSort) {
          case 'price':
            return (a.current_price - b.current_price) * direction;
          case 'volume':
            return (a.total_volume - b.total_volume) * direction;
          case 'change':
            return ((a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)) * direction;
          case 'market_cap':
          default:
            return ((a.market_cap || 0) - (b.market_cap || 0)) * direction;
        }
      });

      const table = buildTable(sortedCoins, resolvedCurrency);
      console.log(table.toString());
      logger.success(`Displayed top ${sortedCoins.length} coins in ${resolvedCurrency.toUpperCase()}.`);
    });
}
