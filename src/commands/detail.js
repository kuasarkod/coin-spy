import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { resolveCurrency } from '../utils/preferences.js';
import { logger } from '../utils/logger.js';
import { renderDetailView } from '../utils/detailView.js';

export default function registerDetailCommand(program) {
  program
    .command('detail <coinId>')
    .description('Display detailed coin information')
    .option('-c, --currency <currency>', 'Currency to display values in', 'usd')
    .action(async (coinId, options) => {
      const currency = resolveCurrency(options.currency);

      const detail = await withSpinner('Fetching coin detail...', async () => coingeckoService.getCoinDetail(coinId, currency));
      if (!detail) {
        logger.warn('Coin detail couldn\'t be retrieved.');
        return;
      }

      const chartData = await withSpinner('Fetching market chart...', async () => coingeckoService.getMarketChart(coinId, currency, 7));
      const prices = chartData?.prices?.map((item) => item[1]) || [];

      renderDetailView(detail, currency, prices);
      logger.success(`Displayed detailed information for ${detail.name}.`);
    });
}
