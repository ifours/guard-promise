# Guard Promise

Guard Promise let you write your `async/await` code in more synchronous way.

## Main idea

Guard Promise always return an array of two elements: `[data, err]`. The first element is normal data, that you can get if your promise resolved. The second one, is the reason of promise rejection. That allows your not to use `try/catch` for _operational errors_.

## Basic usage
Returning a resolved Promise
```
import guard from 'guard-promise';

const simpleResolveRequest = () => Promise.resolve('some data');

(async () => {
  const [data, err] = await guard(simpleResolveRequest());
  
  if (err) {
    // handle error
  }
  
  console.log(data, err); // 'some data', undefined
})();
```
Returning a rejected Promise
```
import guard from 'guard-promise';

const simpleRejectRequest = () => Promise.reject('some err');

(async () => {
  const [data, err] = await guard(simpleRejectRequest());
  
  if (err) {
    console.log(err) // 'some err'
  }
})();
```

*NOTE:* if `simpleRejectRequest` is `async` function, guard() will also handle _programmer errors_, because `async/await` function rejects the Promise it returns when function throws an exception. You can specify global predicate for Guard Promise to filter _operational errors_:
```
import { configGuard } from 'guard-promise';

configGuard({
  predicate: e => e.code
});
// guard() will be rejected if predicate returns false
```
