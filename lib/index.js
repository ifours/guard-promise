"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.guard = exports.configGuard = void 0;
var predicate;

var shouldRejectPromiseWith = function shouldRejectPromiseWith(err) {
  return predicate && !predicate(err);
};

var configGuard = function configGuard(config) {
  predicate = config.predicate;
};

exports.configGuard = configGuard;

var guard = function guard(promise) {
  return new Promise(function (resolve, reject) {
    promise.then(function (data) {
      return resolve([data, undefined]);
    }, function (err) {
      if (shouldRejectPromiseWith(err)) return reject(err);
      resolve([undefined, err]);
    });
  });
};

exports.guard = guard;
var _default = guard;
exports.default = _default;