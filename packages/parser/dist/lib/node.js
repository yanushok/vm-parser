"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COMMAND = exports.LABEL = void 0;

var _fp = require("lodash/fp");

const LABEL = 'LABEL';
exports.LABEL = LABEL;
const COMMAND = 'COMMAND';
exports.COMMAND = COMMAND;

class Node {
  constructor(value, i, globalString) {
    const [cmd, arg] = (0, _fp.pipe)((0, _fp.split)(' '), (0, _fp.map)(_fp.trim))(value);
    this.value = cmd;
    this.localString = i;
    this.globalString = globalString;

    if (this.value.includes(':')) {
      this.type = LABEL;
      this.value = this.value.split(':')[0];
    } else {
      this.type = COMMAND;
    }

    if (isNaN(Number(arg))) {
      this.arg = arg || null;
    } else {
      this.arg = Number(arg);
    }
  }

}

var _default = Node;
exports.default = _default;