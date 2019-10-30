"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = parser;

var _node = require("./lib/node");

var _superviser = _interopRequireDefault(require("./lib/superviser"));

var _commands = _interopRequireDefault(require("./lib/commands"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codeParser(instructions = '') {
  const removeComments = cmd => cmd.split('#')[0];

  const removeEmptyStrings = cmd => cmd.trim() !== '';

  const trim = cmd => cmd.trim(); // create object of function representation, name - function name, body - array of commands


  const parseFunction = funcText => {
    let [name, ...body] = funcText.split('\n').map(removeComments).filter(removeEmptyStrings).map(trim);
    body = body.map((cmd, i) => new _node.Node(cmd, i));
    return {
      name,
      body
    };
  }; // spliting source code to functions


  let res = instructions.split('function').slice(1).map(parseFunction); // transform array to object, key - function name, value - array of commands

  res = res.reduce((prev, current) => {
    prev[current.name] = current.body;
    return prev;
  }, {});
  return res;
}

function parser(instructions = '') {
  const stack = new _superviser.default();
  const functions = codeParser(instructions);
  const commands = new _commands.default(stack, functions);

  function subscribe(fnName, handler) {
    commands.on(fnName, handler);
  }

  function interpret() {
    // subscribe('out', function (value) {
    //     console.log('out', value);
    // });
    // subscribe('finish', function (data) {
    //     console.log(data);
    // });
    // subscribe('ret', function (data) {
    //     console.log(data);
    // });
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          subscribe('finish', function (data) {
            resolve(data);
          });
          commands.call('main');
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return {
    interpret,
    subscribe
  };
}