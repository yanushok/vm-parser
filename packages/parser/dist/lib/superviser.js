"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vmError = _interopRequireDefault(require("../utils/vmError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_STACK_SIZE = 256;

class Superviser {
  constructor() {
    this._mainStack = [];
    this._functionsStack = [];
  }

  pop() {
    return this._mainStack.pop();
  }

  push(val) {
    if (this._mainStack.length < MAX_STACK_SIZE) {
      this._mainStack.push(val);
    } else {
      throw new Error('Data stack overflow');
    }
  }

  getState() {
    return this._mainStack;
  }

  getTopValue() {
    return this._mainStack[this._mainStack.length - 1];
  }

  pushFunction(fn) {
    this._functionsStack.push(fn);
  }

  popFunction() {
    return this._functionsStack.pop();
  }

}

var _default = Superviser;
exports.default = _default;