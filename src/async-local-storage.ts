import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();
export const ID = 'id';

/**
 * Gets the request id from the store.  Will return undefined if the store has not yet been
 * initialized for this request or if request id is disabled.
 */
export function id(): string | undefined {
  const store = asyncLocalStorage.getStore();
  return store?.get(ID) as string;
}

/**
 * Gets a value from the store by key.  Will return undefined if the store has not yet been
 * initialized for this request orif a value is not found for the specified key.
 * @param {string} key
 */
export function get(key: string): unknown {
  const store = asyncLocalStorage.getStore();
  return store?.get(key);
}

/**
 * Adds a value to the store by key.  If the key already exists, its value will be overwritten.
 * No value will persist if the store has not yet been initialized.
 * @param {string} key
 * @param {any} value
 */
export function set(key: string, value: unknown): void {
  const store = asyncLocalStorage.getStore();
  store?.set(key, value);
}
