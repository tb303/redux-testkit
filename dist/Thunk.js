'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (thunkFunction, extraArgument) {
  var dispatch = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(action) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!_lodash2.default.isFunction(action) && !_lodash2.default.isPlainObject(action)) {
                error = new Error('unsupported ' + action + ' action type sent to dispatch');
              }
              dispatches.push(createDispatchedObject(action));

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function dispatch(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var dispatches = [];
  var state = void 0;
  var originalState = void 0;
  var error = void 0;

  function getState() {
    return state;
  }

  function executeDispatch(action) {
    if (_lodash2.default.isFunction(action)) {
      return action(dispatch, getState, extraArgument);
    }
    error = new Error('provided action is not a thunk function');
    return null;
  }

  function checkForStateMutation() {
    var mutated = !utils.deepEqual(state, originalState);
    if (mutated) {
      error = new Error('state mutated after running the thunk');
    }
  }

  function internalThunkCommands() {
    return {
      execute: function execute() {
        if (_lodash2.default.isFunction(thunkFunction)) {
          var dispatchResult = executeDispatch(thunkFunction.apply(undefined, arguments));
          if (!utils.isPromise(dispatchResult)) {
            checkForStateMutation();
            if (error) {
              throw error;
            }
            return dispatches;
          } else {
            return dispatchResult.then(function () {
              checkForStateMutation();
              if (error) {
                throw error;
              }
              return dispatches;
            });
          }
        }
        throw new Error('you must pass a thunk function to Thunk()');
      }
    };
  }

  return _extends({
    withState: function withState(storeState) {
      state = storeState;
      originalState = _lodash2.default.cloneDeep(storeState);
      return internalThunkCommands();
    }
  }, internalThunkCommands());
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createDispatchedObject(action) {
  return {
    isFunction: function isFunction() {
      return _lodash2.default.isFunction(action);
    },
    isPlainObject: function isPlainObject() {
      return _lodash2.default.isPlainObject(action);
    },
    getType: function getType() {
      return _lodash2.default.get(action, 'type');
    },
    getAction: function getAction() {
      return action;
    },
    getName: function getName() {
      return _lodash2.default.get(action, 'name');
    }
  };
}