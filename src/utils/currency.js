import chalk from 'chalk';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../config/constants.js';
import { logger } from './logger.js';

export const normalizeCurrency = (currency) => {
  if (!currency) return DEFAULT_CURRENCY;
  const lower = currency.toLowerCase();
  if (!SUPPORTED_CURRENCIES.includes(lower)) {
    logger.warn(chalk.yellow(`Unsupported currency "${currency}". Falling back to ${DEFAULT_CURRENCY.toUpperCase()}.`));
    return DEFAULT_CURRENCY;
  }
  return lower;
};
