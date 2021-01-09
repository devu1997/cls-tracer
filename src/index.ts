import { get, id, set } from './async-local-storage';
import { jobMiddleware } from './middlewares/job';
import { koaMiddleware } from './middlewares/koa';

export const koaTracer = koaMiddleware;
export const jobTracer = jobMiddleware;
export const tracer = {
  id: id,
  get: get,
  set: set
}