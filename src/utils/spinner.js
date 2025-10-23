import ora from 'ora';
import chalk from 'chalk';

export const withSpinner = async (message, fn, { successMessage, failMessage } = {}) => {
  const spinner = ora({ text: message, color: 'cyan' }).start();
  try {
    const result = await fn(spinner);
    spinner.succeed(chalk.green(successMessage || message.replace(/\.\.\.$/, ' done.')));
    return result;
  } catch (error) {
    spinner.fail(chalk.red(failMessage || `${message.replace(/\.\.\.$/, '')} failed.`));
    throw error;
  }
};

export const createSpinner = (message) => ora({ text: message, color: 'cyan' });
