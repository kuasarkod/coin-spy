import Conf from 'conf';
import { FAVORITES_KEY, ALERTS_KEY, PREFERENCES_KEY, OFFLINE_CACHE_KEY_PREFIX } from '../config/constants.js';

const schema = {
  [FAVORITES_KEY]: {
    type: 'array',
    default: []
  },
  [ALERTS_KEY]: {
    type: 'array',
    default: []
  },
  [PREFERENCES_KEY]: {
    type: 'object',
    properties: {
      currency: { type: 'string' },
      sort: { type: 'string' }
    },
    default: {}
  }
};

const store = new Conf({
  projectName: 'crypto-tracker-cli',
  schema
});

const unique = (array) => Array.from(new Set(array));

export const storage = {
  getFavorites() {
    return store.get(FAVORITES_KEY, []);
  },
  addFavorite(id) {
    const updated = unique([...this.getFavorites(), id]);
    store.set(FAVORITES_KEY, updated);
    return updated;
  },
  removeFavorite(id) {
    const updated = this.getFavorites().filter((item) => item !== id);
    store.set(FAVORITES_KEY, updated);
    return updated;
  },
  getAlerts() {
    return store.get(ALERTS_KEY, []);
  },
  setAlert(alert) {
    const alerts = this.getAlerts().filter(
      (item) => item.id !== alert.id || item.currency !== alert.currency || item.type !== alert.type
    );
    alerts.push(alert);
    store.set(ALERTS_KEY, alerts);
    return alerts;
  },
  removeAlert(id, currency, type) {
    const alerts = this.getAlerts().filter((item) => {
      if (type) {
        return !(item.id === id && item.currency === currency && item.type === type);
      }
      return !(item.id === id && item.currency === currency);
    });
    store.set(ALERTS_KEY, alerts);
    return alerts;
  },
  getPreferences() {
    return store.get(PREFERENCES_KEY, {});
  },
  setPreferences(preferences) {
    const current = this.getPreferences();
    store.set(PREFERENCES_KEY, { ...current, ...preferences });
  },
  setOfflineCache(key, data) {
    store.set(`${OFFLINE_CACHE_KEY_PREFIX}:${key}`, {
      timestamp: Date.now(),
      data
    });
  },
  getOfflineCache(key) {
    return store.get(`${OFFLINE_CACHE_KEY_PREFIX}:${key}`, null);
  }
};
