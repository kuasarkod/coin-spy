import axios from 'axios';
import chalk from 'chalk';
import { cacheFactory } from '../utils/cache.js';
import { storage } from '../utils/storage.js';
import {
  CACHE_TTL_SECONDS,
  COINGECKO_BASE_URL,
  RATE_LIMIT_INTERVAL_MS,
  REQUEST_TIMEOUT_MS,
  RETRY_ATTEMPTS,
  RETRY_DELAY_MS
} from '../config/constants.js';
import { logger } from '../utils/logger.js';

const baseURL = COINGECKO_BASE_URL;
const cache = cacheFactory(CACHE_TTL_SECONDS);
let lastRequestTime = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createHttpClient = () => {
  const instance = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      Accept: 'application/json'
    }
  });

  instance.interceptors.request.use(async (config) => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < RATE_LIMIT_INTERVAL_MS) {
      const waitTime = RATE_LIMIT_INTERVAL_MS - elapsed;
      await sleep(waitTime);
    }
    lastRequestTime = Date.now();
    return config;
  });

  return instance;
};

const http = createHttpClient();

const withRetry = async (fn, cacheKey) => {
  let attempt = 0;
  let lastError;

  while (attempt < RETRY_ATTEMPTS) {
    try {
      const result = await fn();
      if (cacheKey) {
        cache.set(cacheKey, result);
        storage.setOfflineCache(cacheKey, result);
      }
      return result;
    } catch (error) {
      lastError = error;
      attempt += 1;
      const status = error?.response?.status;
      const message = status ? `${status} ${error.response.statusText}` : error.message;
      logger.warn(`Request failed (${attempt}/${RETRY_ATTEMPTS}): ${message}`);
      if (attempt < RETRY_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  if (cacheKey) {
    const offline = storage.getOfflineCache(cacheKey);
    if (offline) {
      logger.warn(chalk.yellow('Serving data from offline cache.')); 
      return offline.data;
    }
  }

  throw lastError;
};

const getCached = (key) => cache.get(key);

export const coingeckoService = {
  async getMarkets({
    vs_currency,
    per_page = 50,
    page = 1,
    order = 'market_cap_desc',
    ids
  }) {
    const idKey = Array.isArray(ids) ? ids.sort().join(',') : ids || 'all';
    const cacheKey = `markets:${vs_currency}:${per_page}:${page}:${order}:${idKey}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get('/coins/markets', {
        params: {
          vs_currency,
          order,
          per_page,
          page,
          ids: Array.isArray(ids) ? ids.join(',') : ids,
          price_change_percentage: '24h'
        }
      });
      return data;
    }, cacheKey);
  },

  async search(query) {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get('/search', {
        params: { query }
      });
      return data;
    }, cacheKey);
  },

  async getCoinDetail(id, vs_currency) {
    const cacheKey = `detail:${id}:${vs_currency}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });
      return data;
    }, cacheKey);
  },

  async getMarketChart(id, vs_currency, days = 7) {
    const cacheKey = `chart:${id}:${vs_currency}:${days}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get(`/coins/${id}/market_chart`, {
        params: { vs_currency, days }
      });
      return data;
    }, cacheKey);
  },

  async getTrending() {
    const cacheKey = 'trending';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get('/search/trending');
      return data;
    }, cacheKey);
  },

  async getSimplePrice(ids, vs_currencies) {
    const cacheKey = `price:${ids}:${vs_currencies}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    return withRetry(async () => {
      const { data } = await http.get('/simple/price', {
        params: {
          ids,
          vs_currencies,
          include_last_updated_at: true
        }
      });
      return data;
    }, cacheKey);
  }
};
