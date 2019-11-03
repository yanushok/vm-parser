"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class VmError {
  constructor(line, msg) {
    this.line = line;
    this.msg = msg;
  }

  toString() {
    return `LINE: ${this.line}, MESSAGE: ${this.msg}`;
  }

}

exports.default = VmError;