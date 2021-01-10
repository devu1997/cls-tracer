import { get, id, set } from './async-local-storage';
import { jobMiddleware } from './middlewares/job';
import { koaMiddleware } from './middlewares/koa';

export default {
  id,
  get,
  set,
  koaMiddleware,
  jobMiddleware
}