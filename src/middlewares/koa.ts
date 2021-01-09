import { asyncLocalStorage, ID } from '../async-local-storage';
import { v1 as uuidv1 } from 'uuid';
import { Context, Middleware, Next } from 'koa';

export interface KoaLocalStorageOptions {
  useRequestId?: boolean,
  useHeader?: boolean,
  headerName?: string,
  requestIdFactory?: () => string,
  echoHeader?: boolean
}

/** Koa middleware that is responsible for initializing the store for each request. 
 * @param {KoaLocalStorageOptions} 
*/
export function koaMiddleware(options: KoaLocalStorageOptions = {}): Middleware {
  const defaultKoaLocalStorageOptions = {
    useRequestId: false,
    useHeader: false,
    headerName: 'x-request-id',
    requestIdFactory: uuidv1,
    echoHeader: false
  };
  const { useRequestId, useHeader, headerName, requestIdFactory, echoHeader } = Object.assign(defaultKoaLocalStorageOptions, options);
  return function (ctx: Context, next: Next) {
    const store = new Map<string, any>();
    if (useRequestId) {
      const idFromHeader = ctx.get(headerName);
      const id = (useHeader && idFromHeader) ? idFromHeader : requestIdFactory();
      store.set(ID, id);
      if (echoHeader) {
        ctx.set(headerName, id);
      }
    }
    return asyncLocalStorage.run(store, () => {
      return next();
    });
  }
}