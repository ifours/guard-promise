"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var shouldRejectPromiseWith = function shouldRejectPromiseWith(err) {
  return predicate && !predicate(err);
};

var predicate = void 0;
var setupTuplePromise = exports.setupTuplePromise = function setupTuplePromise(config) {
  predicate = config.predicate;
};

var createTuplePromise = exports.createTuplePromise = function createTuplePromise(originalCall) {
  var defaultData = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  return function TuplePromise() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      originalCall.apply(_this, args).then(function (data) {
        return resolve([data, null]);
      }, function (err) {
        if (shouldRejectPromiseWith(err)) reject(err);
        resolve([defaultData, err]);
      });
    });
  };
};

exports.default = createTuplePromise;