"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var predicate = void 0;
var shouldRejectPromiseWith = function shouldRejectPromiseWith(err) {
  return predicate && !predicate(err);
};

var configGuard = exports.configGuard = function configGuard(config) {
  predicate = config.predicate;
};

var guard = exports.guard = function guard(promise) {
  return new Promise(function (resolve, reject) {
    promise.then(function (data) {
      return resolve([data, undefined]);
    }, function (err) {
      if (shouldRejectPromiseWith(err)) return reject(err);
      resolve([undefined, err]);
    });
  });
};