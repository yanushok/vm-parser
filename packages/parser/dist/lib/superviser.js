"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Superviser {
  constructor() {
    this._mainStack = [];
  }

  pop() {
    return this._mainStack.pop();
  }

  push(val) {
    return this._mainStack.push(val);
  }

  getState() {
    return this._mainStack;
  }

}

var _default = Superviser;
exports.default = _default;