class Cache {
  constructor(ttlSeconds = 60) {
    this.ttl = ttlSeconds * 1000;
    this.store = new Map();
  }

  _isExpired(entry) {
    return Date.now() > entry.expiry;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (this._isExpired(entry)) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.store.set(key, { value, expiry });
    return value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cacheFactory = (ttlSeconds) => new Cache(ttlSeconds);
