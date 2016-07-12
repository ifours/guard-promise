import "babel-core/register";
import "babel-polyfill";
import expect, { createSpy, spyOn, isSpy } from 'expect';
import {
  golangTupleConfig as Config,
  golangTupleDecorator as Decorator
} from '../';

describe('golang tuple method decorator', function() {

  afterEach(function() {
    Config({});
  });


  it('should resolve simple promise', async function() {
    class Service {
      @Decorator
      simpleResolveRequest(passedData) {
        return Promise.resolve(passedData);
      }
    }

    const passedData = 'some data';
    const [data, err] = await new Service().simpleResolveRequest(passedData);

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject simple promise', async function() {
    class Service {
      @Decorator
      simpleRejectRequest(passedError) {
        return Promise.reject(passedError);
      }
    }

    const passedError = 'some err';
    const [data, err] = await new Service().simpleRejectRequest(passedError);

    expect(data).toNotExist();
    expect(err).toBe(passedError);
  });

  it('should resolve async method', async function() {
    class Service {
      @Decorator
      async asyncResolveRequest(passedData) {
        return passedData;
      }
    }

    const passedData = 'some data';
    const [data, err] = await new Service().asyncResolveRequest(passedData);

    expect(data).toBe(passedData);
    expect(err).toNotExist();
  });

  it('should reject async method with Promise.reject', async function() {
    class Service {
      @Decorator
      async asyncRejectRequest(passedError) {
        return Promise.reject(passedError);
      }
    }

    const passedError = 'some err';
    const [data, err] = await new Service().asyncRejectRequest(passedError);

    expect(data).toNotExist();
    expect(err).toBe(passedError);
  });

  it('should reject async method with "throw" statement', async function() {
    class Service {
      @Decorator
      async asyncRejectRequest(passedError) {
        throw new Error(passedError);
        return 'will never return';
      }
    }

    const passedError = 'some error';
    const [data, err] = await new Service().asyncRejectRequest(passedError);

    expect(data).toNotExist();
    expect(err.message).toBe(passedError);
  });

  it('should not handle programmer errors', async function() {
    class Service {
      @Decorator
      someRequest() {
        functionThatDoesNotExist();
      }
    }

    let error;

    try {
      await new Service().someRequest();
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle programmer errors in async method by default', async function() {
    class Service {
      @Decorator
      async someRequest() {
        functionThatDoesNotExist();
      }
    }

    const [data, err] = await new Service().someRequest();

    expect(err).toExist();
  });

  it('should not handle programmer errors in async method with predicate', async function() {

    Config({
      predicate: e => e.code
    });

    let error;

    class Service {
      @Decorator
      async asyncRejectRequest() {
        functionThatDoesNotExist();
      }
    }

    try {
      await new Service().asyncRejectRequest();
    } catch(e) {
      error = e;
    }

    expect(error).toExist();
  });

  it('should handle operational errors in async method', async function() {
    class Service {
      @Decorator
      resolveRequestThatThrowError() {
        return Promise.resolve().then(() => { throw new Error() });
      }
    }

    const [data, err] = await new Service().resolveRequestThatThrowError();

    expect(err).toExist();
    expect(data).toNotExist();
  });

  it('should handle operational errors in async method if predicate returns true', async function() {
    Config({
      predicate: e => e.code
    });

    class Service {
      @Decorator
      resolveRequestThatThrowError() {
        return Promise.resolve().then(() => { throw { code } });
      }
    }

    const code = 404;
    const [data, err] = await new Service().resolveRequestThatThrowError();

    expect(err.code).toBe(code);
    expect(data).toNotExist();
  });


  it('should not handle operational errors in async method if predicate returns false', async function() {
    Config({
      predicate: e => e.code
    });

    class Service {
      @Decorator
      resolveRequestThatThrowError() {
        return Promise.resolve().then(() => { throw { id: code } });
      }
    }

    let error;
    const code = 404;

    try {
      await new Service().resolveRequestThatThrowError();
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

    class Service {
      @Decorator(defaultData)
      async rejectRequest() {
        throw new Error();
      }
    }

    const [{ foo, baz }, err] = await new Service().rejectRequest();

    expect(err).toExist();
    expect(foo).toBe(defaultData.foo);
    expect(baz).toBe(defaultData.baz);
  });

});
