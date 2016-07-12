import "babel-core/register";
import "babel-polyfill";
import expect, { createSpy, spyOn, isSpy } from 'expect';
import {
  CreateTuplePromise as Wrapper,
  setupTuplePromise as Config
} from '../';

describe('golang tuple function wrapper', function() {

  afterEach(function() {
    Config({});
  });

  it('should resolve simple promise', function() {
    const passedData = 'some data';
    const simpleResolveRequest = (data) => Promise.resolve(data);

    return Wrapper(simpleResolveRequest)(passedData).then(function ([data, err]) {
      expect(data).toBe(passedData);
      expect(err).toNotExist();
    });
  });

  it('should resolve simple promise in async funсtion', async function() {
    const passedData = 'some data';
    const simpleResolveRequest = (data) => Promise.resolve(data);

    const [data, err] = await Wrapper(simpleResolveRequest)(passedData);

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject simple promise', function() {
    const passedError = 'some err';
    const simpleRejectRequest = (err) => Promise.reject(err);

    return Wrapper(simpleRejectRequest)(passedError).then(([data, err]) => {
      expect(data).toNotExist();
      expect(err).toBe(passedError);
    });
  });

  it('should reject simple promise in async funсtion', async function() {
    const passedError = 'some err';
    const simpleRejectRequest = (err) => Promise.reject(err);

    const [data, err] = await Wrapper(simpleRejectRequest)(passedError);

    expect(data).toNotExist();
    expect(err).toBe(passedError);
  });

  it('should resolve async function', function() {
    const passedData = 'some data';

    async function asyncResolveRequest(data) {
      return data;
    }

    return Wrapper(asyncResolveRequest)(passedData).then(([data, err]) => {
      expect(data).toBe(passedData);
      expect(err).toNotExist();
    });
  });

  it('should resolve async function in async function', async function() {
    const passedData = 'some data';

    async function asyncResolveRequest(data) {
      return data;
    }

    const [data, err] = await Wrapper(asyncResolveRequest)(passedData);

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject async function', function() {
    const passedError = 'some data';

    async function asyncRejectRequest(error) {
      throw new Error(error);
      return 'never return';
    }

    return Wrapper(asyncRejectRequest)(passedError).then(([data, err]) => {
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

    const [data, err] = await Wrapper(asyncRejectRequest)(passedError);

    expect(data).toNotExist();
    expect(err.message).toBe(passedError);
  });


  it('should not handle programmer errors', async function() {
    let error;

    function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    try {
      await Wrapper(asyncRejectRequest)();
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle programmer errors in async function by default', async function() {
    async function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    const [data, err] = await Wrapper(asyncRejectRequest)();

    expect(err).toExist();
  });

  it('should not handle programmer errors in async function with predicate', async function() {

    Config({
      predicate: e => e.code
    });

    let error;

    async function asyncRejectRequest() {
      functionThatDoesNotExist();
    }

    try {
      await Wrapper(asyncRejectRequest)();
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle operational errors', function() {
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw new Error() });

    return Wrapper(resolveRequestThatThrowError)().then(([data, err]) => {
      expect(err).toExist();
      expect(data).toNotExist();
    });
  });

  it('should handle operational errors in async function', async function() {
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw new Error() });

    const [data, err] = await Wrapper(resolveRequestThatThrowError)();

    expect(err).toExist();
    expect(data).toNotExist();
  });

  it('should handle operational errors if predicate returns true', function() {
    Config({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { code } });

    return Wrapper(resolveRequestThatThrowError)().then(([data, err]) => {
      expect(err.code).toBe(code)
      expect(data).toNotExist();
    });
  });

  it('should handle operational errors in async function if predicate returns true', async function() {
    Config({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { code } });

    const [data, err] = await Wrapper(resolveRequestThatThrowError)();

    expect(err.code).toBe(code);
    expect(data).toNotExist();
  });

  it('should not handle operational errors if predicate returns false', function() {
    Config({
      predicate: e => e.code
    });

    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { id: code } });

    return Wrapper(resolveRequestThatThrowError)().catch(error => expect(error.id).toBe(code));
  });

  it('should not handle operational errors in async function if predicate returns false', async function() {
    Config({
      predicate: e => e.code
    });

    let error;
    const code = 404;
    const resolveRequestThatThrowError = () => Promise.resolve().then(() => { throw { id: code } });

    try {
      await Wrapper(resolveRequestThatThrowError)();
    } catch(e) {
      error = e;
    }

    expect(error.id).toBe(code);
  });

  it('should accept default data', async function() {
    const defaultData = {
      foo: 'bar',
      baz: 'qux'
    };
    const rejectRequest = () => Promise.reject('err')

    const [{ foo, baz }, err] = await Wrapper(rejectRequest, defaultData)();

    expect(err).toExist();
    expect(foo).toBe(defaultData.foo);
    expect(baz).toBe(defaultData.baz);
  });

});
