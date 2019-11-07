"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class VmError extends Error {
  constructor(line, msg) {
    super();
    this.line = line;
    this.msg = msg;
  }

  toString() {
    return `LINE: ${this.line}, MESSAGE: ${this.msg}`;
  }

}

exports.default = VmError;