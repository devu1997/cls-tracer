import { asyncLocalStorage, ID } from '../async-local-storage';
import { v1 as uuidv1 } from 'uuid';

export interface JobLocalStorageOptions {
  useJobId?: boolean,
  jobIdFactory?: () => string,
}

/** Middleware that is responsible for initializing the store for background jobs. 
 * @param {jobFn}
 * @param {options}
*/
export function jobMiddleware<T>(jobFn: () => T, options: JobLocalStorageOptions = {}): T {
  const defaultJobLocalStorageOptions= {
    useJobId: false,
    jobIdFactory: uuidv1
  };
  const { useJobId, jobIdFactory } = Object.assign(defaultJobLocalStorageOptions, options);
  const store = new Map<string, any>();
  if (useJobId) {
    const id = jobIdFactory();
    store.set(ID, id);
  }
  return asyncLocalStorage.run(store, jobFn);
}