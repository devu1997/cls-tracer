import { logger } from './logger';
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

async function sampleJob(): Promise<void> {
  tracer.set('key', { data: 'data' });
  logger.info('Inside sample background job');
  await fakeAsyncTask();
}

setInterval(tracer.jobMiddleware, 10000, sampleJob, { useJobId: true });
