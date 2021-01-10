# cls-tracer

Continuous local storage for koa and custom jobs based on AsyncLocalStorage. The package is an enhanced version of [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer) with added support to store any key-value pairs in the local storage.

* Out of the box support for request/job id tracing.
* Supports reading request id from header.
* Supports writing request id to header.
* Supports typescript.

## Supported Node.js versions

As cls-tracer depends on AsyncLocalStorage API, it requires Node.js 12.17.0+, 13.14.0+, or 14.0.0+. 


## Install

`npm install cls-tracer`

## Usage - Koa middleware

Register the middleware provided by the library with your koa app. Make sure you use any third party middleware (or plugin) that does not need access to request ids before you use cls-tracer.

```typescript
import tracer from 'cls-tracer; \\ javascript: const tracer = require('cls-tracer');

const app = new Koa()
app.use(tracer.koaMiddleware({
  enableRequestId: true,
  useHeader: true,
  echoHeader: true
}));
```

Set a key anywhere in the code inside the async call chain.

```typescript
tracer.set('key', 'value);
```

You can access the same request id and keys from any code inside the async call chain that does not have access to the Koa's `context` object.

```typescript
const id = tracer.id();
const value = tracer.get('key');
```

### Configuration

These are the available config options for the middleware. All config entries are optional.

```typescript
{
  // If set to true, the middleware will always generate a request id
  // per each request (default: false).
  enableRequestId: false,
  // Respect request header flag (default: false).
  // If set to true, the middleware will always use a value from
  // the specified header (if the value is present).
  // Used if useRequestId is set to true.
  useHeader: false,
  // Request/response header name, case insensitive (default: 'X-Request-Id').
  // Used if useRequestId and useHeader/echoHeader is set to true.
  headerName: 'X-Request-Id',
  // A custom function to generate your request ids (default: UUID v1).
  // Ignored if useHeader is set to true.
  // Used if useRequestId is set to true.
  requestIdFactory: () => 'Your request id',
  // Add request id to response header (default: false).
  // If set to true, the middleware will add request id to the specified header.
  // Use headerName option to specify header name.
  // Used if useRequestId is set to true.
  echoHeader: false
}
```

## Usage - Custom jobs

Wrap your job function inside the middleware provided by the library.

```typescript
import tracer from 'cls-tracer; \\ javascript: const tracer = require('cls-tracer');

const response = tracer.jobMiddleware(jobFunction, {
  enableJobId: true
});
```

Set a key anywhere in the code inside the async call chain.

```typescript
tracer.set('key', 'value);
```

You can access the same request id and keys from anywhere in the code inside the async call chain.

```typescript
const id = tracer.id();
const value = tracer.get('key');
```

The middleware returns the response of job function. Hence, can be used along with async/await.

```typescript
const response = await tracer.jobMiddleware(jobFunction);
```


### Configuration

These are the available config options for the middleware. All config entries are optional.

```typescript
{
  // If set to true, the middleware will always generate a job id
  // per each execution of job function wrapped by the middlware (default: false).
  enableJobId: false,
  // A custom function to generate your request ids (default: UUID v1).
  // Ignored if useHeader is set to true.
  // Used if useRequestId is set to true.
  jobIdFactory: () => 'Your job id'
}
```

## Performance impact

Note that this library has a certain performance impact on your application due to AsyncLocalStorage API usage.

## License

Licensed under MIT.

