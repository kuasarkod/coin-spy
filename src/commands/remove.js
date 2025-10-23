import inquirer from 'inquirer';
import chalk from 'chalk';
import { storage } from '../utils/storage.js';
import { logger } from '../utils/logger.js';

export default function registerRemoveCommand(program) {
  program
    .command('remove <coinId>')
    .description('Remove a coin from favorites')
    .action(async (coinId) => {
      const favorites = storage.getFavorites();
      if (!favorites.includes(coinId)) {
        logger.warn(`Coin ${coinId} is not in favorites.`);
        return;
      }

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove ${coinId} from favorites?`,
          default: false
        }
      ]);

      if (!confirm) {
        logger.info('Operation cancelled.');
        return;
      }

      storage.removeFavorite(coinId);
      logger.success(chalk.greenBright(`${coinId} removed from favorites.`));
    });
}
