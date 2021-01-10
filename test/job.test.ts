
import tracer from '../src';

describe('cls-tracer for jobs', () => {

  test('does not return id outside of job', () => {
    const id = tracer.id()
    expect(id).toBeUndefined()
  })

  test('generates id for job', async () => {
    const job = () => {
      const id = tracer.id();
      setTimeout(() => {
        expect(tracer.id()).toBe(id);
      }, 0);
      return id;
    }
    const id = tracer.jobMiddleware(job, { useJobId: true });
    expect(id?.length).toBeGreaterThan(0);
  });

  test('generates id for job from provided job id factory', () => {
    const idFactory = () => 'generatedId';

    const job = () => {
      const id = tracer.id();
      expect(id).toBe('generatedId');
      setTimeout(() => {
        expect(tracer.id()).toBe('generatedId');
      }, 0);
      return id;
    };
    const id = tracer.jobMiddleware(job, { useJobId: true, jobIdFactory: idFactory });
    expect(id).toBe('generatedId');
  });

  test('set a key along with generating job id', async () => {
    const idFactory = () => 'generatedId';

    const job = () => {
      const id = tracer.id();
      expect(id).toBe('generatedId');
      tracer.set('key', 'value');
      setTimeout(() => {
        expect(tracer.id()).toBe('generatedId');
        expect(tracer.get('key')).toBe('value');
      }, 0);
      return {
        id,
        key: tracer.get('key')
      };
    };
    const res = tracer.jobMiddleware(job, { useJobId: true, jobIdFactory: idFactory });
    expect(res.id).toBe('generatedId');
    expect(res.key).toBe('value');
  });

  test('set a key without generating job id', async () => {
    const job = () => {
      const id = tracer.id();
      expect(id).toBeUndefined();
      tracer.set('key', 'value');
      setTimeout(() => {
        expect(tracer.id()).toBeUndefined();
        expect(tracer.get('key')).toBe('value');
      }, 0);
      return {
        id,
        key: tracer.get('key')
      };
    };
    const res = tracer.jobMiddleware(job);
    expect(res.id).toBeUndefined();
    expect(res.key).toBe('value');
  });
});