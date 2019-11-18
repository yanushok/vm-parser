"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = parser;

var _fp = require("lodash/fp");

var _lodash = _interopRequireDefault(require("lodash"));

var _node = _interopRequireDefault(require("./node"));

var _vmError = _interopRequireDefault(require("../utils/vmError"));

var _commands = require("../utils/commands");

var _commands2 = _interopRequireDefault(require("./commands"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codeParser(tuples = []) {
  function tupleReducer(state, [number, command]) {
    if (command.includes('function')) {
      return [...state, [[number, command.split(' ').pop()]]];
    } else {
      const len = state.length;

      if (!len) {
        return state;
      }

      state[len - 1].push([number, command]);
      return state;
    }
  }

  function functionsReducer(state, [[number, functionName], ...commands]) {
    return { ...state,
      [functionName]: {
        string: number,
        commands: commands.map(([numOfString, cmdString], localIndex) => new _node.default(cmdString, localIndex, numOfString))
      }
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

    if (mnemonic[mnemonic.length - 1] === ':') {
      if (arg) {
        errors.push(new _vmError.default(line, `Label must not have any arguments`));
      }

      return;
    }

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
  let hasErrors = false;
  const options = Object.assign({}, {
    debug: false,
    breakpoints: null
  }, opts);
  const vm = new _commands2.default(options);

  function emit(...args) {
    vm.emit(...args);
  }

  function subscribe(...args) {
    vm.on(...args);
  }

  function getStatus() {
    return vm.getStatus();
  }

  function parse() {
    const tuples = createTuples(instructions);
    const errors = checkErrors(tuples);

    if (errors.length) {
      hasErrors = true;
      throw errors;
    } else {
      const functionsObject = codeParser(tuples);
      vm.setFunctions(functionsObject);
    }
  }

  function next() {
    return new Promise((resolve, reject) => {
      if (!options.debug) {
        return reject(new Error('Debug mode is off. Step by step execution disabled'));
      }

      setImmediate(() => {
        try {
          resolve(vm.next());
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
          vm.start();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  return {
    interpret,
    subscribe,
    next,
    parse,
    getStatus
  };
}