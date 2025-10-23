import { coingeckoService } from '../services/coingecko.js';
import { cacheFactory } from './cache.js';
import { CACHE_TTL_SECONDS } from '../config/constants.js';

const resolverCache = cacheFactory(CACHE_TTL_SECONDS * 5);

const cacheKey = (input) => `coin-resolve:${input.toLowerCase()}`;

export const resolveCoin = async (input) => {
  const key = input.trim().toLowerCase();
  if (!key) return null;

  const cached = resolverCache.get(cacheKey(key));
  if (cached) return cached;

  const tryDetail = async () => {
    try {
      const detail = await coingeckoService.getCoinDetail(key, 'usd');
      if (detail?.id) {
        return {
          id: detail.id,
          symbol: detail.symbol,
          name: detail.name
        };
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const detail = await tryDetail();
  if (detail) {
    resolverCache.set(cacheKey(key), detail);
    return detail;
  }

  const search = await coingeckoService.search(key);
  const coins = search?.coins || [];
  const matchById = coins.find((coin) => coin.id.toLowerCase() === key);
  const matchBySymbol = coins.find((coin) => coin.symbol.toLowerCase() === key);
  const match = matchById || matchBySymbol || coins[0];

  if (!match) return null;

  const resolved = {
    id: match.id,
    symbol: match.symbol,
    name: match.name
  };

  resolverCache.set(cacheKey(key), resolved);
  return resolved;
};
