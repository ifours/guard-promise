import "babel-core/register";
import "babel-polyfill";
import expect, { createSpy, spyOn, isSpy } from 'expect';
import guard, { configGuard } from '../';

describe('golang tuple function wrapper', function() {

  afterEach(function() {
    configGuard({});
  });

  it('should resolve simple promise', function() {
    const passedData = 'some data';
    const simpleResolveRequest = (data) => Promise.resolve(data);

    return guard(simpleResolveRequest(passedData)).then(([data, err]) => {
      expect(data).toBe(passedData);
      expect(err).toNotExist();
    });
  });

  it('should resolve simple promise in async funсtion', async function() {
    const passedData = 'some data';
    const simpleResolveRequest = (data) => Promise.resolve(data);

    const [data, err] = await guard(simpleResolveRequest(passedData));

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject simple promise', function() {
    const passedError = 'some err';
    const simpleRejectRequest = (err) => Promise.reject(err);

    return guard(simpleRejectRequest(passedError)).then(([data, err]) => {
      expect(data).toNotExist();
      expect(err).toBe(passedError);
    });
  });

  it('should reject simple promise in async funсtion', async function() {
    const passedError = 'some err';
    const simpleRejectRequest = (err) => Promise.reject(err);

    const [data, err] = await guard(simpleRejectRequest(passedError));

    expect(data).toNotExist();
    expect(err).toBe(passedError);
  });

  it('should resolve async function', function() {
    const passedData = 'some data';

    async function asyncResolveRequest(data) {
      return data;
    }

    return guard(asyncResolveRequest(passedData)).then(([data, err]) => {
      expect(data).toBe(passedData);
      expect(err).toNotExist();
    });
  });

  it('should resolve async function in async function', async function() {
    const passedData = 'some data';

    async function asyncResolveRequest(data) {
      return data;
    }

    const [data, err] = await guard(asyncResolveRequest(passedData));

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject async function', function() {
    const passedError = 'some data';

    async function asyncRejectRequest(error) {
      throw new Error(error);
      return 'never return';
    }

    return guard(asyncRejectRequest(passedError)).then(([data, err]) => {
      expect(data).toNotExist();
      expect(err.message).toBe(passedError);
    });
  });

  it('should reject async function in async function', async function() {
    const passedError = 'some data';

    async function asyncRejectRequest(error) {
      throw new Error(error);
      return 'never return';
    }

    const [data, err] = await guard(asyncRejectRequest(passedError));

    expect(data).toNotExist();
    expect(err.message).toBe(passedError);
  });


  it('should not handle programmer errors', async function() {
    let error;

    function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    try {
      await guard(asyncRejectRequest());
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle programmer errors in async function by default', async function() {
    async function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    const [data, err] = await guard(asyncRejectRequest());

    expect(err).toExist();
  });

  it('should not handle programmer errors in async function with predicate', async function() {

    configGuard({
      predicate: e => e.code
    });

    let error;

    async function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    try {
      await guard(asyncRejectRequest());
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle operational errors', function() {
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw new Error() });

    return guard(resolveRequestThatThrowError()).then(([data, err]) => {
      expect(err).toExist();
      expect(data).toNotExist();
    });
  });

  it('should handle operational errors in async function', async function() {
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw new Error() });

    const [data, err] = await guard(resolveRequestThatThrowError());

    expect(err).toExist();
    expect(data).toNotExist();
  });

  it('should handle operational errors if predicate returns true', function() {
    configGuard({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { code } });

    return guard(resolveRequestThatThrowError()).then(([data, err]) => {
      expect(err.code).toBe(code)
      expect(data).toNotExist();
    });
  });

  it('should handle operational errors in async function if predicate returns true', async function() {
    configGuard({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { code } });

    const [data, err] = await guard(resolveRequestThatThrowError());

    expect(err.code).toBe(code);
    expect(data).toNotExist();
  });

  it('should not handle operational errors if predicate returns false', function() {
    configGuard({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { id: code } });

    return guard(resolveRequestThatThrowError()).catch(error => expect(error.id).toBe(code));
  });

  it('should not handle operational errors in async function if predicate returns false', async function() {
    configGuard({
      predicate: e => e.code
    });

    let error;
    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { id: code } });

    try {
      await guard(resolveRequestThatThrowError());
    } catch(e) {
      error = e;
    }

    expect(error.id).toBe(code);
  });

  it('should resolve Promise.all', async function() {
    const foo = 'foo';
    const bar = 'bar';
    const simpleResolveRequest = (data) => Promise.resolve(data);

    const [[fooResponce, barResponce], err] = await guard(Promise.all([
      simpleResolveRequest(foo),
      simpleResolveRequest(bar)
    ]));

    expect(err).toNotExist();
    expect(fooResponce).toBe(foo);
    expect(barResponce).toBe(bar);
  });

  it('should reject Promise.all', async function() {
    const foo = 'foo';
    const bar = 'bar';
    const rejectRequest = (err) => Promise.reject(err);
    const simpleResolveRequest = (data) => Promise.resolve(data);

    const [[fooResponce, barResponce] = [], err] = await guard(Promise.all([
      simpleResolveRequest(foo),
      rejectRequest(bar)
    ]));

    expect(err).toBe(bar);
    expect(fooResponce).toNotExist();
    expect(barResponce).toNotExist();
  });

});
