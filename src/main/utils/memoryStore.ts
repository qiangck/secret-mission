import NodeCache from 'node-cache';

type Options = {
  expires?: number;
  checkperiod?: number;
};

const ONE_DAY = 60 * 60 * 24;

const DEFAULT_OPTION = {
  expires: ONE_DAY / 2,
  checkperiod: 10 * 60,
};

export default class MemoryStore {
  store: NodeCache;
  options: { expires: number; checkperiod: number } & Options;

  constructor(options?: Options) {
    this.options = Object.assign({}, DEFAULT_OPTION, options);

    this.store = new NodeCache({
      stdTTL: this.options.expires,
      checkperiod: this.options.checkperiod,
    });
  }

  async all() {
    let sessions = [];

    const allKeys = this.store.keys();

    const allValues = this.store.mget(allKeys);

    for (let i in allValues) {
      if (allValues.hasOwnProperty(i)) {
        sessions.push(allValues[i]);
      }
    }

    return sessions;
  }

  async destroy(sessionId: string) {
    return this.store.del(sessionId);
  }

  async clear() {
    return this.store.flushAll();
  }

  async get(sessionId: string) {
    return this.store.get(sessionId);
  }

  async set(sessionId: string, session: any) {
    const success = await this.store.set(sessionId, session);

    if (!success) {
      return new Error('Insert to store not succeed!');
    }

    return success;
  }

  async touch(sessionId: string, session: any) {
    this.store.del(sessionId);

    this.set(sessionId, session);
  }
}
