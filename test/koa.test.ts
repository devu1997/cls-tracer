import Koa from 'koa';
import request from 'supertest';
import tracer from '../src';

describe('cls-tracer for koa', () => {
  test('does not return id outside of request', () => {
    const id = tracer.id();
    expect(id).toBeUndefined();
  });

  test('generates id for request', async () => {
    const app = new Koa();

    app.use(
      tracer.koaMiddleware({
        useRequestId: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
  });

  test('generates id for request from provided request id factory', async () => {
    const app = new Koa();
    const idFactory = () => 'generatedId';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        requestIdFactory: idFactory
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual('generatedId');
  });

  test('ignores header by default', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('X-Request-Id', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.body.id).not.toEqual(idInHeader);
  });

  test('uses default header in case of override', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('X-Request-Id', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(idInHeader);
  });

  test('uses different header in case of override', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: true,
        headerName: 'new-header'
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('new-header', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(idInHeader);
  });

  test('ignores header if not set', async () => {
    const app = new Koa();

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
  });

  test('ignores header if disabled', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: false
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('X-Request-Id', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.body.id).not.toEqual(idInHeader);
  });

  test('ignores header if disabled', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: false
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('X-Request-Id', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.body.id).not.toEqual(idInHeader);
  });

  test('do not echo header by default', async () => {
    const app = new Koa();

    app.use(
      tracer.koaMiddleware({
        useRequestId: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.get('X-Request-Id')).toBeUndefined();
  });

  test('do not echo header', async () => {
    const app = new Koa();
    const idInHeader = 'id-from-header';

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: true,
        echoHeader: false
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/').set('X-Request-Id', idInHeader);
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.body.id).toEqual(idInHeader);
    expect(res.get('X-Request-Id')).toBeUndefined();
  });

  test('echo header', async () => {
    const app = new Koa();

    app.use(
      tracer.koaMiddleware({
        useRequestId: true,
        useHeader: true,
        echoHeader: true
      })
    );
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id()
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.get('X-Request-Id')).toEqual(res.body.id);
  });

  test('set a key along with generating request id', async () => {
    const app = new Koa();

    app.use(
      tracer.koaMiddleware({
        useRequestId: true
      })
    );
    app.use((_, next) => {
      tracer.set('key', 'value');
      next();
    });
    app.use((ctx) => {
      ctx.body = {
        id: tracer.id(),
        key: tracer.get('key')
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id.length).toBeGreaterThan(0);
    expect(res.body.key).toBe('value');
  });

  test('set a key without generating request id', async () => {
    const app = new Koa();

    app.use(tracer.koaMiddleware());
    app.use((_, next) => {
      tracer.set('key', 'value');
      next();
    });
    app.use((ctx) => {
      ctx.body = {
        key: tracer.get('key')
      };
    });

    const res = await request(app.callback()).get('/');
    expect(res.status).toBe(200);
    expect(res.body.id).toBeUndefined();
    expect(res.body.key).toBe('value');
  });
});
