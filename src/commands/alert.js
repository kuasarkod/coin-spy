import inquirer from 'inquirer';
import Table from 'cli-table3';
import chalk from 'chalk';
import { storage } from '../utils/storage.js';
import { resolveCurrency } from '../utils/preferences.js';
import { formatCurrency } from '../utils/formatter.js';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { resolveCoin } from '../utils/coins.js';
import { logger } from '../utils/logger.js';

const parseThreshold = (input) => {
  const value = Number(input);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Threshold must be a positive number.');
  }
  return value;
};

const typeChoices = [
  { name: 'Above threshold', value: 'above' },
  { name: 'Below threshold', value: 'below' }
];

const ensureCoinResolution = async (input) => {
  const coin = await resolveCoin(input);
  if (!coin) {
    throw new Error(`Coin "${input}" could not be resolved.`);
  }
  return coin;
};

const fetchCurrentPrice = async (id, currency) => {
  const markets = await withSpinner('Fetching current price...', async () => {
    const data = await coingeckoService.getMarkets({
      vs_currency: currency,
      ids: [id],
      per_page: 1
    });
    return data || [];
  });
  return markets[0];
};

const handleAddAlert = async ({ coinInput, currencyOption, typeOption, priceOption }) => {
  const coin = await ensureCoinResolution(coinInput);
  const currency = resolveCurrency(currencyOption);

  let type = typeOption;
  if (!type || !['above', 'below'].includes(type)) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select alert type:',
        choices: typeChoices
      }
    ]);
    type = answer.type;
  }

  let threshold = priceOption;
  if (!threshold) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'threshold',
        message: `Enter price threshold in ${currency.toUpperCase()}:`,
        validate: (value) => {
          try {
            parseThreshold(value);
            return true;
          } catch (error) {
            return error.message;
          }
        }
      }
    ]);
    threshold = answer.threshold;
  }

  const numericThreshold = parseThreshold(threshold);

  const marketInfo = await fetchCurrentPrice(coin.id, currency);
  if (!marketInfo) {
    throw new Error('Unable to retrieve current market data for the specified coin.');
  }

  storage.setAlert({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    currency,
    type,
    threshold: numericThreshold,
    createdAt: Date.now()
  });

  logger.success(
    chalk.green(
      `Alert set for ${coin.name} (${coin.symbol.toUpperCase()}) when price is ${
        type === 'above' ? 'above' : 'below'
      } ${formatCurrency(numericThreshold, currency)} (current: ${formatCurrency(marketInfo.current_price, currency)}).`
    )
  );
};

const handleRemoveAlert = async ({ coinInput, currencyOption, typeOption }) => {
  const alerts = storage.getAlerts();
  if (!alerts.length) {
    logger.info(chalk.blue('No alerts configured. Use "crypto alert add" to create one.'));
    return;
  }

  const coin = await ensureCoinResolution(coinInput);
  const currency = resolveCurrency(currencyOption);
  const matchingAlerts = alerts.filter((alert) => alert.id === coin.id && alert.currency === currency);

  if (!matchingAlerts.length) {
    logger.warn(`No alerts found for ${coin.name} in ${currency.toUpperCase()}.`);
    return;
  }

  let type = typeOption;
  if (!type || !['above', 'below'].includes(type)) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select alert to remove:',
        choices: matchingAlerts.map((alert) => ({
          name: `${alert.type.toUpperCase()} ${formatCurrency(alert.threshold, alert.currency)}`,
          value: alert.type
        }))
      }
    ]);
    type = answer.type;
  }

  storage.removeAlert(coin.id, currency, type);
  logger.success(chalk.green(`Removed ${type.toUpperCase()} alert for ${coin.name} in ${currency.toUpperCase()}.`));
};

const handleListAlerts = () => {
  const alerts = storage.getAlerts();
  if (!alerts.length) {
    logger.info(chalk.blue('No price alerts configured.'));
    return;
  }

  const table = new Table({
    head: [chalk.blue('Coin'), chalk.blue('Currency'), chalk.blue('Type'), chalk.blue('Threshold'), chalk.blue('Created At')],
    style: { head: [], border: [] }
  });

  alerts.forEach((alert) => {
    table.push([
      `${alert.name || alert.id} (${(alert.symbol || '').toUpperCase()})`,
      alert.currency.toUpperCase(),
      alert.type.toUpperCase(),
      formatCurrency(alert.threshold, alert.currency),
      new Date(alert.createdAt).toLocaleString()
    ]);
  });

  console.log(table.toString());
  logger.success(`Listed ${alerts.length} alerts.`);
};

export default function registerAlertCommand(program) {
  const alertCommand = program.command('alert').description('Manage price alerts');

  alertCommand
    .command('add <coin>')
    .description('Add a price alert for a coin')
    .option('-c, --currency <currency>', 'Currency for the threshold', 'usd')
    .option('-t, --type <type>', 'Alert type (above|below)')
    .option('-p, --price <price>', 'Price threshold')
    .action(async (coin, options) => {
      try {
        await handleAddAlert({
          coinInput: coin,
          currencyOption: options.currency,
          typeOption: options.type,
          priceOption: options.price
        });
      } catch (error) {
        logger.error(error.message);
      }
    });

  alertCommand
    .command('remove <coin>')
    .description('Remove a price alert for a coin')
    .option('-c, --currency <currency>', 'Currency of the alert', 'usd')
    .option('-t, --type <type>', 'Alert type (above|below)')
    .action(async (coin, options) => {
      try {
        await handleRemoveAlert({
          coinInput: coin,
          currencyOption: options.currency,
          typeOption: options.type
        });
      } catch (error) {
        logger.error(error.message);
      }
    });

  alertCommand
    .command('list')
    .description('List all configured price alerts')
    .action(() => {
      handleListAlerts();
    });
}
