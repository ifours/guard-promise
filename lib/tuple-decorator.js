'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = TuplePromiseDecorator;
exports.Decorator = Decorator;

var _tuplePromise = require('./tuple-promise');

var _tuplePromise2 = _interopRequireDefault(_tuplePromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TuplePromiseDecorator() {
  var _arguments = arguments;

  if (arguments.length === 1) {
    var _ret = function () {
      var defaultData = _arguments.length <= 0 ? undefined : _arguments[0];

      return {
        v: function v() {
          for (var _len = arguments.length, innerArgs = Array(_len), _key = 0; _key < _len; _key++) {
            innerArgs[_key] = arguments[_key];
          }

          return Decorator.apply(undefined, innerArgs.concat([defaultData]));
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return Decorator.apply(undefined, arguments);
  }
}

function Decorator(target, key, descriptor) {
  var defaultData = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var originalCall = descriptor.value;

  if (typeof originalCall !== 'function') {
    throw new Error('@golangTupleDecorator can only be applied to methods not: ' + (typeof originalCall === 'undefined' ? 'undefined' : _typeof(originalCall)));
  }

  return {
    configurable: true,
    get: function get() {
      return (0, _tuplePromise2.default)(originalCall, defaultData);
    }
  };
}