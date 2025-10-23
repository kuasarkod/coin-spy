import chalk from 'chalk';
import Table from 'cli-table3';
import { coingeckoService } from '../services/coingecko.js';
import { storage } from '../utils/storage.js';
import { resolveCurrency } from '../utils/preferences.js';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatter.js';
import { logger } from '../utils/logger.js';
import { sendNotification } from '../utils/notifier.js';

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

const checkAlerts = (coins, currency) => {
  const alerts = storage.getAlerts();
  if (!alerts.length) return;

  coins.forEach((coin) => {
    const matchingAlerts = alerts.filter((alert) => alert.id === coin.id && alert.currency === currency);
    matchingAlerts.forEach((alert) => {
      const price = coin.current_price;
      if (alert.type === 'above' && price >= alert.threshold) {
        sendNotification({
          title: 'Price Alert Triggered',
          message: `${coin.name} is above ${formatCurrency(alert.threshold, currency)}`
        });
        logger.success(chalk.greenBright(`${coin.name} crossed above ${formatCurrency(alert.threshold, currency)}.`));
        storage.removeAlert(alert.id, alert.currency, alert.type);
      }
      if (alert.type === 'below' && price <= alert.threshold) {
        sendNotification({
          title: 'Price Alert Triggered',
          message: `${coin.name} is below ${formatCurrency(alert.threshold, currency)}`
        });
        logger.warn(chalk.yellow(`${coin.name} dropped below ${formatCurrency(alert.threshold, currency)}.`));
        storage.removeAlert(alert.id, alert.currency, alert.type);
      }
    });
  });
};

export default function registerWatchCommand(program) {
  program
    .command('watch')
    .description('Watch favorite coins in real-time')
    .option('-i, --interval <seconds>', 'Refresh interval in seconds', (value) => parseInt(value, 10), 60)
    .option('-c, --currency <currency>', 'Currency to display values', 'usd')
    .action(async (options) => {
      const favorites = storage.getFavorites();
      if (!favorites.length) {
        logger.info(chalk.blue('No favorite coins yet. Use "crypto add <coin-id>" to add one.'));
        return;
      }

      const currency = resolveCurrency(options.currency);
      const intervalSeconds = Number.isFinite(options.interval) ? Math.max(options.interval, 10) : 60;

      let active = true;
      const fetchAndRender = async () => {
        if (!active) return;
        try {
          const coins = await coingeckoService.getMarkets({
            vs_currency: currency,
            ids: favorites
          });
          console.clear();
          console.log(chalk.cyan(`Watching favorites (${currency.toUpperCase()}) - updated ${new Date().toLocaleTimeString()}`));
          const table = buildTable(coins, currency);
          console.log(table.toString());
          checkAlerts(coins, currency);
          logger.info(`Next refresh in ${intervalSeconds} seconds. Press Ctrl+C to exit.`);
        } catch (error) {
          logger.error(`Failed to fetch data: ${error.message}`);
        }
      };

      await fetchAndRender();
      const timer = setInterval(fetchAndRender, intervalSeconds * 1000);

      const stop = () => {
        active = false;
        clearInterval(timer);
        console.log('\n' + chalk.blue('Watch mode exited.'));
        process.exit(0);
      };

      process.on('SIGINT', stop);
      process.on('SIGTERM', stop);
    });
}
