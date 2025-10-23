import chalk from 'chalk';

const currencyFormatters = new Map();
const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2
});

const getCurrencyFormatter = (currency) => {
  const key = currency.toLowerCase();
  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: key.toUpperCase(),
        maximumFractionDigits: 2
      })
    );
  }
  return currencyFormatters.get(key);
};

export const formatCurrency = (value, currency = 'usd') => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '-';
  }
  try {
    return getCurrencyFormatter(currency).format(numericValue);
  } catch (error) {
    return `${numericValue.toFixed(2)} ${currency.toUpperCase()}`;
  }
};

export const formatNumber = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '-';
  }
  return numberFormatter.format(numericValue);
};

export const formatPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '-';
  }
  const formatted = `${numericValue > 0 ? '+' : ''}${numericValue.toFixed(2)}%`;
  if (numericValue > 0) {
    return chalk.green(formatted);
  }
  if (numericValue < 0) {
    return chalk.red(formatted);
  }
  return chalk.blue(formatted);
};

export const formatChange = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '-';
  }
  const formatted = `${numericValue > 0 ? '+' : ''}${numericValue.toFixed(2)}%`;
  if (numericValue > 0) {
    return chalk.greenBright(formatted);
  }
  if (numericValue < 0) {
    return chalk.redBright(formatted);
  }
  return chalk.yellowBright(formatted);
};

export const truncateText = (text, limit = 300) => {
  if (!text) return '-';
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};

export const padLabel = (label, width = 16) => label.padEnd(width, ' ');
