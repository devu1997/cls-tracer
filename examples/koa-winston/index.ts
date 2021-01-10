import Koa, { Context } from 'koa';
import http from 'http';
import { logger } from './logger';
import Router from 'koa-router';
import tracer from 'cls-tracer';

function fakeAsyncTask(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = tracer.get('key');
      logger.info(`Inside fake async task with data ${JSON.stringify(data)}`);
      resolve();
    }, 0);
  });
}

export async function sample(ctx: Context): Promise<void> {
  tracer.set('key', {
    data: 'data'
  });
  logger.info('Inside sample API');
  await fakeAsyncTask();
  ctx.body = {
    status: 'ok'
  };
}

function startHttpServer(): void {
  const app = new Koa();
  const router = new Router();

  app.context.api = true;
  app.use(
    tracer.koaMiddleware({
      enableRequestId: true,
      useHeader: true,
      echoHeader: true
    })
  );
  router.get('/sample', sample);
  app.use(router.routes());
  app.use(router.allowedMethods());

  http.createServer(app.callback()).listen(8080, () => {
    logger.info('Http server is up and running on port 8080');
  });
}

startHttpServer();
