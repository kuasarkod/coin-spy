import chalk from 'chalk';

const normalizeValues = (values, height) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values.map((value) => Math.round(((value - min) / range) * (height - 1)));
};

export const renderAsciiChart = (prices, options = {}) => {
  const { height = 10, width = 40, color = chalk.green } = options;
  if (!Array.isArray(prices) || prices.length === 0) {
    return 'No chart data available.';
  }

  const sampled = prices.length > width
    ? prices.filter((_, index) => index % Math.ceil(prices.length / width) === 0).slice(-width)
    : prices;

  const normalized = normalizeValues(sampled, height);
  const rows = Array.from({ length: height }, () => Array(sampled.length).fill(' '));

  normalized.forEach((value, index) => {
    for (let i = 0; i <= value; i += 1) {
      rows[height - 1 - i][index] = color('█');
    }
  });

  return rows.map((row) => row.join('')).join('\n');
};
