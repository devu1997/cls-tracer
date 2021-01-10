import { asyncLocalStorage, ID } from '../async-local-storage';
import { Context, Middleware, Next } from 'koa';
import { v1 as uuidv1 } from 'uuid';

export interface KoaLocalStorageOptions {
  readonly enableRequestId?: boolean;
  readonly useHeader?: boolean;
  readonly headerName?: string;
  readonly requestIdFactory?: () => string;
  readonly echoHeader?: boolean;
}

/** Koa middleware that is responsible for initializing the store for each request.
 * @param {KoaLocalStorageOptions}
 */
export function koaMiddleware(options: KoaLocalStorageOptions = {}): Middleware {
  const defaultKoaLocalStorageOptions = {
    useRequestId: false,
    useHeader: false,
    headerName: 'X-Request-Id',
    requestIdFactory: uuidv1,
    echoHeader: false
  };
  const { enableRequestId, useHeader, headerName, requestIdFactory, echoHeader } = Object.assign(defaultKoaLocalStorageOptions, options);
  return function (ctx: Context, next: Next) {
    const store = new Map<string, unknown>();
    if (enableRequestId) {
      const idFromHeader = ctx.get(headerName.toLowerCase());
      const id = useHeader && idFromHeader ? idFromHeader : requestIdFactory();
      store.set(ID, id);
      if (echoHeader) {
        ctx.set(headerName, id);
      }
    }
    return asyncLocalStorage.run(store, () => {
      return next();
    });
  };
}
