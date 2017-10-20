'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMiddleware = createMiddleware;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createMiddleware() {
  var _this = this;

  var pendingPromises = [];

  var middleware = function middleware() {
    return function (next) {
      return function (action) {
        var returnValue = void 0;
        if (typeof action === 'function') {
          var actionWrapper = function actionWrapper() {
            var result = action.apply(undefined, arguments);

            if (result && result.then && typeof result.then === 'function') {
              pendingPromises.push(result);
            }
            return result;
          };
          returnValue = next(actionWrapper);
        } else {
          returnValue = next(action);
        }

        return returnValue;
      };
    };
  };

  middleware.flush = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var promisesCount;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promisesCount = pendingPromises.length;

            if (!(promisesCount > 0)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return Promise.all(pendingPromises);

          case 4:
            // remove resolved promises
            pendingPromises = pendingPromises.slice(promisesCount);
            _context.next = 7;
            return middleware.flush();

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  middleware.reset = function () {
    pendingPromises = [];
  };

  return middleware;
}