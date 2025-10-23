import chalk from 'chalk';
import { coingeckoService } from '../services/coingecko.js';
import { withSpinner } from '../utils/spinner.js';
import { formatCurrency } from '../utils/formatter.js';
import { logger } from '../utils/logger.js';

export default function registerConvertCommand(program) {
  program
    .command('convert <amount> <from> <to>')
    .description('Convert between cryptocurrencies or fiat currencies')
    .action(async (amount, from, to) => {
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        logger.error('Amount must be a positive number.');
        return;
      }

      const result = await withSpinner('Converting...', async () => {
        const data = await coingeckoService.getSimplePrice(from.toLowerCase(), to.toLowerCase());
        return data;
      });

      const price = result?.[from.toLowerCase()]?.[to.toLowerCase()];
      if (!price) {
        logger.error(`Unable to convert ${from.toUpperCase()} to ${to.toUpperCase()}.`);
        return;
      }

      const converted = parsedAmount * price;
      console.log(chalk.green(`${parsedAmount} ${from.toUpperCase()} = ${formatCurrency(converted, to)}`));
      logger.success('Conversion completed.');
    });
}
