import Table from 'cli-table3';
import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';

export default function registerTrendingCommand(program) {
  program
    .command('trending')
    .description('Show currently trending cryptocurrencies')
    .action(async () => {
      const data = await withSpinner('Fetching trending coins...', async () => {
        const response = await coingeckoService.getTrending();
        return response?.coins || [];
      });

      if (!data.length) {
        logger.warn('No trending data available.');
        return;
      }

      const table = new Table({
        head: [
          chalk.blue('Rank'),
          chalk.blue('Name'),
          chalk.blue('Symbol'),
          chalk.blue('Price (BTC)'),
          chalk.blue('Market Cap Rank')
        ],
        style: { head: [], border: [] }
      });

      data.forEach((item, index) => {
        const coin = item.item;
        table.push([
          index + 1,
          coin.name,
          coin.symbol.toUpperCase(),
          coin.price_btc ? `${coin.price_btc.toFixed(8)} BTC` : '-',
          coin.market_cap_rank ?? '-'
        ]);
      });

      console.log(table.toString());
      logger.success(`Displayed ${data.length} trending coins.`);
    });
}
