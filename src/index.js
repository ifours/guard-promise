let predicate;

const shouldRejectPromiseWith = (err) =>
  predicate && !predicate(err);

export function golangTupleWrapper(originalCall, defaultData = null) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      originalCall.apply(this, args).then(
        (data) => resolve([data, null]),
        (err) => {
          if (shouldRejectPromiseWith(err)) reject(err);
          resolve([defaultData, err]);
        }
      );
    });
  }
}

export function golangTupleDecorator(...args) {
  if (args.length === 1) {
    const defaultData = args[0];

    return function(...innerArgs) {
      return Decorator(...innerArgs, defaultData);
    };
  } else {
    return Decorator(...args);
  }
}

export function Decorator(target, key, descriptor, defaultData = null) {
  const originalCall = descriptor.value;

  if (typeof originalCall !== 'function') {
    throw new Error(`@golangTupleDecorator can only be applied to methods not: ${typeof originalCall}`);
  }

  return {
    configurable: true,
    get() {
      return function(...args) {
        return new Promise((resolve, reject) => {
          originalCall.apply(this, args).then(
            (data) => resolve([data, null]),
            (err) => {
              if (shouldRejectPromiseWith(err)) reject(err);
              resolve([defaultData, err]);
            }
          );
        });
      }
    }
  };
}

export function golangTupleConfig(config) {
  predicate = config.predicate;
}
