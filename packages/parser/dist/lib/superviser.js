"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.INPROGRESS = exports.FAILED = exports.COMPLETED = exports.WAITING = void 0;
const WAITING = 'WAITING';
exports.WAITING = WAITING;
const COMPLETED = 'COMPLETED';
exports.COMPLETED = COMPLETED;
const FAILED = 'FAILED';
exports.FAILED = FAILED;
const INPROGRESS = 'INPROGRESS';
exports.INPROGRESS = INPROGRESS;

class Superviser {
  constructor() {
    this._mainStack = [];
    this._functionsStack = [];
    this._status = INPROGRESS;
  }

  pop() {
    return this._mainStack.pop();
  }

  push(val) {
    this._mainStack.push(val);
  }

  getState() {
    return this._mainStack;
  }

  pushFunction(fnName, commandString) {
    this._functionsStack.push({
      fnName,
      commandString
    });
  }

  popFunction() {
    return this._functionsStack.pop();
  }

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    setTimeout(() => {
      this._status = status;
    }, 0);
  }

}

var _default = Superviser;
exports.default = _default;