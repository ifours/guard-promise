'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TuplePromiseDecorator = exports.setupTuplePromise = exports.CreateTuplePromise = undefined;

var _tuplePromise = require('./tuple-promise');

Object.defineProperty(exports, 'setupTuplePromise', {
  enumerable: true,
  get: function get() {
    return _tuplePromise.setupTuplePromise;
  }
});

var _tuplePromise2 = _interopRequireDefault(_tuplePromise);

var _tupleDecorator = require('./tuple-decorator');

var _tupleDecorator2 = _interopRequireDefault(_tupleDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CreateTuplePromise = _tuplePromise2.default;
exports.TuplePromiseDecorator = _tupleDecorator2.default;