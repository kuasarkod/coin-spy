import chalk from 'chalk';
import { storage } from '../utils/storage.js';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';

export default function registerAddCommand(program) {
  program
    .command('add <coinId>')
    .description('Add a coin to favorites')
    .action(async (coinId) => {
      const detail = await withSpinner('Validating coin...', async () => {
        try {
          return await coingeckoService.getCoinDetail(coinId, 'usd');
        } catch (error) {
          return null;
        }
      });

      if (!detail) {
        logger.error(`Coin with id "${coinId}" could not be found.`);
        return;
      }

      storage.addFavorite(coinId);
      logger.success(chalk.greenBright(`${detail.name} added to favorites.`));
    });
}
