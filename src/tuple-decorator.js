import createTuplePromise from './tuple-promise';

export default function TuplePromiseDecorator(...args) {
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
      return createTuplePromise(originalCall, defaultData);
    }
  };
}
