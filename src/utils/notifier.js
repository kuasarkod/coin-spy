import notifier from 'node-notifier';
import chalk from 'chalk';
import { logger } from './logger.js';

export const sendNotification = ({ title, message }) => {
  try {
    notifier.notify({
      title,
      message
    });
  } catch (error) {
    logger.debug(`Notification failed: ${chalk.red(error.message)}`);
  }
};
