"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = parser;

var _events = _interopRequireDefault(require("events"));

var _fp = require("lodash/fp");

var _lodash = _interopRequireDefault(require("lodash"));

var _node = _interopRequireDefault(require("./node"));

var _superviser = _interopRequireDefault(require("./superviser"));

var _vmError = _interopRequireDefault(require("../utils/vmError"));

var _commands = require("../utils/commands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codeParser(tuples = []) {
  function tupleReducer(state, [number, command]) {
    if (command.includes('function')) {
      return [...state, [command.split(' ').pop()]];
    } else {
      const len = state.length;

      if (!len) {
        return state;
      }

      state[len - 1].push([number, command]);
      return state;
    }
  }

  function functionsReducer(state, [functionName, ...commands]) {
    return { ...state,
      [functionName]: commands.map(([numOfString, cmdString], i) => [numOfString, new _node.default(cmdString, i, numOfString)])
    };
  }

  return tuples.reduce(tupleReducer, []).reduce(functionsReducer, {});
}

function createTuples(instructions = '') {
  let numberOfString = 1;
  return (0, _lodash.default)(instructions).split('\n').map((0, _fp.pipe)((0, _fp.split)('#'), _fp.head, _fp.trim, str => [numberOfString++, str])).filter(_fp.last).value();
}

function checkErrors(tuples = []) {
  const errors = [];
  tuples.forEach(([line, instruction]) => {
    const [cmd, arg, ...rest] = instruction.split(' ').filter(x => x.length);
    const mnemonic = cmd.toLowerCase();
    if (mnemonic === '') return;
    if (mnemonic[mnemonic.length - 1] === ':') return;

    if (!(0, _commands.isCommand)(mnemonic)) {
      errors.push(new _vmError.default(line, `Unknown opcode "${mnemonic}"`));
      return;
    }

    if (rest.length > 0) {
      errors.push(new _vmError.default(line, `Command "${mnemonic}" has only one argument`));
      return;
    }

    if (arg === undefined && !(0, _commands.isNarrowCommand)(mnemonic)) {
      errors.push(new _vmError.default(line, `Command "${mnemonic}" must have an arguments`));
      return;
    }

    if (arg !== undefined && !(0, _commands.isWideCommand)(mnemonic)) {
      errors.push(new _vmError.default(line, `Command "${mnemonic}" must not have arguments`));
      return;
    }
  });
  return errors;
}

function parser(instructions, opts = {}) {
  let tuples = [];
  let functionsObject = {};
  let hasErrors = false;
  const emitter = new _events.default();
  const mainStack = new _superviser.default();
  const options = Object.assign({}, {
    debug: false,
    breakpoints: null
  }, opts);

  function emit(...args) {
    emitter.emit(...args);
  }

  function parse() {
    tuples = createTuples(instructions);
    const errors = checkErrors(tuples);

    if (errors.length) {
      hasErrors = true;
      throw errors;
    } else {
      functionsObject = codeParser(tuples);
    }
  }

  function next() {
    return new Promise((resolve, reject) => {
      if (!options.debug) {
        return reject(new Error('Debug mode is off. Step by step execution disabled'));
      }

      setImmediate(() => {
        try {
          resolve();
        } catch (err) {
          reject(err.message);
        }
      });
    });
  }

  function interpret() {
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        if (hasErrors) {
          return reject(new Error('Source code has errors'));
        }

        try {
          resolve(functionsObject);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  return {
    interpret,
    next,
    parse
  };
}