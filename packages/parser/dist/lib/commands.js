"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Commands extends _events.default {
  constructor(stack, functions) {
    super();
    this.stack = stack;
    this.functions = functions;
  }

  end() {
    this.emit('finish', {
      dataStack: this.stack.getState()
    });
  }

  ret(fnName) {
    this.emit('ret', {
      dataStack: this.stack.getState(),
      fromFunction: fnName
    });
  }

  call(fnName) {
    const executor = new FunctionExecutor(fnName, this.functions[fnName]);
    executor.execute(this);
  }

  push(arg, context) {
    if ((0, _lodash.isNumber)(arg)) {
      this.stack.push(arg);
    } else {
      this.stack.push(context[arg]);
    }
  }

  pop(arg, context) {
    const value = this.stack.pop();
    context[arg] = value;
  }

  dup() {
    const temp = this.stack.pop();
    this.push(temp);
    this.push(temp);
  }

  add() {
    const first = this.stack.pop();
    const second = this.stack.pop();
    this.push(first + second);
  }

  sub() {
    const second = this.stack.pop();
    const first = this.stack.pop();
    this.push(first - second);
  }

  mul() {
    const first = this.stack.pop();
    const second = this.stack.pop();
    this.push(first * second);
  }

  div() {
    const second = this.stack.pop();
    const first = this.stack.pop();
    this.push(Math.round(first / second));
  }

  callext(fnName) {
    const value = this.stack.pop();

    if (this.eventNames().includes(fnName)) {
      this.emit(fnName, value);
    }
  }

  ifeq() {
    const first = this.stack.pop();
    const second = this.stack.pop();
    return first === second;
  }

  ifgr() {
    const second = this.stack.pop();
    const first = this.stack.pop();
    return first > second;
  }

}

class FunctionExecutor {
  constructor(fnName, commands) {
    this.commands = commands;
    this.fnName = fnName;
    this.localScope = {};
  }

  execute(actions) {
    for (let i = 0; i < this.commands.length; i++) {
      const cmd = this.commands[i];
      if (cmd.type === 'label') continue;

      if (cmd.value.includes('if')) {
        if (actions[cmd.value]()) {
          const label = this.commands.filter(x => x.type === 'label').find(x => x.value === cmd.arg + ':');

          if (label) {
            i = label.stringNumber;
          }
        }
      } else if (cmd.value.includes('ret')) {
        actions[cmd.value](this.fnName);
      } else {
        actions[cmd.value](cmd.arg, this.localScope);
      }
    }
  }

}

var _default = Commands;
exports.default = _default;