"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Node = void 0;

class Node {
  constructor(value, i) {
    const [cmd, arg] = value.split(' ').filter(chunk => chunk.trim() !== '');
    this.value = cmd;
    this.stringNumber = i;
    this.type = this.value.includes(':') ? 'label' : 'command';

    if (isNaN(Number(arg))) {
      this.arg = arg || null;
    } else {
      this.arg = Number(arg);
    }
  }

}

exports.Node = Node;