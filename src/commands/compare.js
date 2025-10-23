import Table from 'cli-table3';
import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatter.js';
import { resolveCurrency } from '../utils/preferences.js';
import { logger } from '../utils/logger.js';

const buildComparisonTable = (coinA, coinB, currency) => {
  const table = new Table({
    head: ['Metric', chalk.blue(coinA.name), chalk.blue(coinB.name)],
    style: { head: [], border: [] }
  });

  const metrics = [
    ['Symbol', coinA.symbol.toUpperCase(), coinB.symbol.toUpperCase()],
    ['Current Price', formatCurrency(coinA.current_price, currency), formatCurrency(coinB.current_price, currency)],
    ['24h Change', formatPercent(coinA.price_change_percentage_24h), formatPercent(coinB.price_change_percentage_24h)],
    ['Market Cap', formatNumber(coinA.market_cap), formatNumber(coinB.market_cap)],
    ['Volume (24h)', formatNumber(coinA.total_volume), formatNumber(coinB.total_volume)],
    ['Circulating Supply', formatNumber(coinA.circulating_supply), formatNumber(coinB.circulating_supply)],
    ['Total Supply', formatNumber(coinA.total_supply), formatNumber(coinB.total_supply)],
    ['Ath', formatCurrency(coinA.ath, currency), formatCurrency(coinB.ath, currency)],
    ['Atl', formatCurrency(coinA.atl, currency), formatCurrency(coinB.atl, currency)]
  ];

  metrics.forEach((row) => table.push(row));
  return table;
};

const ensureCoinsFound = (coins, ids) => {
  const map = new Map();
  coins.forEach((coin) => map.set(coin.id, coin));
  return ids.map((id) => map.get(id)).every(Boolean);
};

export default function registerCompareCommand(program) {
  program
    .command('compare <coinA> <coinB>')
    .description('Compare two cryptocurrencies side by side')
    .option('-c, --currency <currency>', 'Currency to display values', 'usd')
    .action(async (coinA, coinB, options) => {
      const currency = resolveCurrency(options.currency);
      const ids = [coinA.toLowerCase(), coinB.toLowerCase()];

      const coins = await withSpinner('Fetching coin data...', async () => {
        const data = await coingeckoService.getMarkets({
          vs_currency: currency,
          ids
        });
        return Array.isArray(data) ? data : [];
      });

      if (!ensureCoinsFound(coins, ids)) {
        logger.error('One or both coins could not be found. Please check the IDs.');
        return;
      }

      const table = buildComparisonTable(coins.find((coin) => coin.id === ids[0]), coins.find((coin) => coin.id === ids[1]), currency);
      console.log(table.toString());
      logger.success(`Compared ${coinA} and ${coinB}.`);
    });
}
