import chalk from 'chalk';

const formatMessage = (label, color, message) => {
  const time = new Date().toLocaleTimeString();
  return `${chalk.dim(`[${time}]`)} ${color(label)} ${message}`;
};

export const logger = {
  info(message) {
    console.log(formatMessage('INFO', chalk.blueBright, message));
  },
  success(message) {
    console.log(formatMessage('SUCCESS', chalk.greenBright, message));
  },
  warn(message) {
    console.warn(formatMessage('WARN', chalk.yellowBright, message));
  },
  error(message) {
    console.error(formatMessage('ERROR', chalk.redBright, message));
  },
  debug(message) {
    if (process.env.DEBUG) {
      console.log(formatMessage('DEBUG', chalk.magentaBright, message));
    }
  }
};
