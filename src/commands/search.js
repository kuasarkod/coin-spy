import inquirer from 'inquirer';
import Table from 'cli-table3';
import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';
import { resolveCurrency } from '../utils/preferences.js';
import { renderDetailView } from '../utils/detailView.js';

const buildResultsTable = (coins) => {
  const table = new Table({
    head: [chalk.blue('Name'), chalk.blue('Symbol'), chalk.blue('Market Cap Rank')],
    style: { head: [], border: [] }
  });

  coins.forEach((coin) => {
    table.push([
      coin.name,
      coin.symbol.toUpperCase(),
      coin.market_cap_rank ?? '-'
    ]);
  });

  return table;
};

export default function registerSearchCommand(program) {
  program
    .command('search <coin>')
    .description('Search cryptocurrencies by name or symbol')
    .option('-c, --currency <currency>', 'Currency for displaying prices', 'usd')
    .action(async (query, options) => {
      const currency = resolveCurrency(options.currency);

      const results = await withSpinner('Searching coins...', async () => {
        const data = await coingeckoService.search(query);
        return data?.coins || [];
      });

      if (!results.length) {
        logger.warn(`No coins found matching "${query}".`);
        return;
      }

      const table = buildResultsTable(results);
      console.log(table.toString());

      const choices = results.map((result) => ({
        name: `${result.name} (${result.symbol.toUpperCase()})`,
        value: result.id
      }));

      const { selectedCoin } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCoin',
          message: 'Select a coin to view details:',
          choices
        }
      ]);

      const detail = await withSpinner('Fetching coin detail...', async () => coingeckoService.getCoinDetail(selectedCoin, currency));

      if (!detail) {
        logger.warn('Coin detail unavailable.');
        return;
      }

      const chartData = await withSpinner('Fetching market chart...', async () =>
        coingeckoService.getMarketChart(selectedCoin, currency, 7)
      );
      const prices = chartData?.prices?.map((item) => item[1]) || [];

      renderDetailView(detail, currency, prices);

      logger.success(`Displayed detail for ${detail.name}.`);
    });
}
