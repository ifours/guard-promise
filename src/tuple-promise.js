const shouldRejectPromiseWith = (err) =>
  predicate && !predicate(err);

let predicate;
export const setupTuplePromise = (config) => {
  predicate = config.predicate;
}

export const createTuplePromise = (originalCall, defaultData = null) => {
  return function TuplePromise(...args) {
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

export default createTuplePromise;
