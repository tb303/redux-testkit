'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (reducer) {
  var defaultInitialState = reducer(undefined, {});

  function internalReducerCommands(initialState) {
    return {
      expect: function (_expect) {
        function expect(_x) {
          return _expect.apply(this, arguments);
        }

        expect.toString = function () {
          return _expect.toString();
        };

        return expect;
      }(function (action) {
        var originalState = _lodash2.default.cloneDeep(initialState);
        var newState = reducer(initialState, action);
        var mutated = !(0, _utils.deepEqual)(initialState, originalState);

        return {
          toReturnState: function toReturnState(expected) {
            expect(newState).toEqual(expected);
            // expect(mutated).toEqual(false);
            if (mutated) {
              throw new Error('state mutated after running reducer');
            }
          },
          toStayTheSame: function toStayTheSame() {
            expect(newState).toBe(initialState);
            // expect(mutated).toEqual(false);
            if (mutated) {
              throw new Error('state mutated after running reducer');
            }
          },
          toChangeInState: function toChangeInState(expectedChanges) {
            var expected = _lodash2.default.mergeWith(originalState, expectedChanges, toChangeInStateCustomizer);
            expect(newState).toEqual(expected);
            // expect(mutated).toEqual(false);
            if (mutated) {
              throw new Error('state mutated after running reducer');
            }
          }
        };
      }),
      execute: function execute(action) {
        var originalState = _lodash2.default.cloneDeep(initialState);
        var newState = reducer(initialState, action);
        var mutated = !(0, _utils.deepEqual)(initialState, originalState);
        if (mutated) {
          throw new Error('state mutated after running reducer');
        }
        return newState;
      }
    };
  }

  return _extends({
    withState: function withState(state) {
      var initialState = state || defaultInitialState;
      return internalReducerCommands(initialState);
    }
  }, internalReducerCommands(defaultInitialState));
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toChangeInStateCustomizer(objValue, srcValue) {
  if (_lodash2.default.isArray(objValue)) {
    return srcValue;
  }
  return undefined;
}