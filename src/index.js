let predicate;
const shouldRejectPromiseWith = (err) =>
  predicate && !predicate(err);

export const configGuard = config => {
  predicate = config.predicate;
};

export const guard = (promise) =>
  new Promise((resolve, reject) => {
    promise.then(
      data => resolve([data, undefined]),
      err => {
        if (shouldRejectPromiseWith(err)) return reject(err);
        resolve([undefined, err]);
      }
    );
  });

export default guard;
