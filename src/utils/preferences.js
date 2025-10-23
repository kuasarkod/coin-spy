import { storage } from './storage.js';
import { DEFAULT_SORT } from '../config/constants.js';
import { normalizeCurrency } from './currency.js';

const VALID_SORT_FIELDS = new Set(['market_cap', 'price', 'volume', 'change']);

export const resolveCurrency = (currency) => {
  if (currency) return normalizeCurrency(currency);
  const { currency: savedCurrency } = storage.getPreferences();
  if (savedCurrency) return normalizeCurrency(savedCurrency);
  return normalizeCurrency();
};

export const resolveSort = (sort) => {
  if (sort && VALID_SORT_FIELDS.has(sort)) return sort;
  const { sort: savedSort } = storage.getPreferences();
  if (savedSort && VALID_SORT_FIELDS.has(savedSort)) return savedSort;
  return DEFAULT_SORT;
};

export const updatePreferences = (preferences) => {
  storage.setPreferences(preferences);
};
