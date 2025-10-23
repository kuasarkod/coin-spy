import Table from 'cli-table3';
import chalk from 'chalk';
import { formatCurrency, formatNumber, formatPercent, padLabel, truncateText } from './formatter.js';
import { renderAsciiChart } from './asciiChart.js';

const safeGet = (object, path, fallback = null) => {
  try {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), object) ?? fallback;
  } catch (error) {
    return fallback;
  }
};

export const buildDetailTable = (detail, currency) => {
  const market = detail.market_data || {};
  const table = new Table({
    colWidths: [22, 60],
    style: { head: [], border: [] }
  });

  const rows = [
    ['Name', detail.name],
    ['Symbol', detail.symbol?.toUpperCase()],
    ['Current Price', formatCurrency(safeGet(market, `current_price.${currency}`), currency)],
    ['Market Cap', formatCurrency(safeGet(market, `market_cap.${currency}`), currency)],
    ['24h High', formatCurrency(safeGet(market, `high_24h.${currency}`), currency)],
    ['24h Low', formatCurrency(safeGet(market, `low_24h.${currency}`), currency)],
    [
      '24h Change',
      formatPercent(safeGet(market, 'price_change_percentage_24h'))
    ],
    [
      'All Time High',
      `${formatCurrency(safeGet(market, `ath.${currency}`), currency)} (${formatPercent(
        safeGet(market, `ath_change_percentage.${currency}`)
      )} from ATH)`
    ],
    [
      'All Time Low',
      `${formatCurrency(safeGet(market, `atl.${currency}`), currency)} (${formatPercent(
        safeGet(market, `atl_change_percentage.${currency}`)
      )} from ATL)`
    ],
    ['Circulating Supply', formatNumber(safeGet(market, 'circulating_supply'))],
    ['Total Supply', formatNumber(safeGet(market, 'total_supply'))],
    ['Max Supply', formatNumber(safeGet(market, 'max_supply'))]
  ];

  rows.forEach(([label, value]) => {
    table.push([chalk.blue(padLabel(label, 20)), value ?? '-']);
  });

  return table;
};

export const renderDetailView = (detail, currency, prices = []) => {
  const table = buildDetailTable(detail, currency);
  console.log(table.toString());

  if (Array.isArray(prices) && prices.length) {
    console.log(chalk.cyan('\n7 Day Price Chart'));
    console.log(renderAsciiChart(prices, { height: 10 }));
  }

  if (detail.description?.en) {
    const cleaned = detail.description.en.replace(/(<([^>]+)>)/gi, '');
    console.log(`\n${chalk.yellow('Description:')}`);
    console.log(truncateText(cleaned, 300));
  }
};
