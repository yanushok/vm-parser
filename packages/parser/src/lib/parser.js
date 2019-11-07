import { pipe, trim, split, head, last } from "lodash/fp";
import _ from 'lodash';

import Node from './node';
import VmError from '../utils/vmError';
import { isCommand, isNarrowCommand, isWideCommand } from "../utils/commands";
import VM from './commands';

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
        return {
            ...state,
            [functionName]: {
                string: number,
                commands: commands.map(([numOfString, cmdString], i) => new Node(cmdString, i, numOfString))
            }
        };
    }

    return tuples
        .reduce(tupleReducer, [])
        .reduce(functionsReducer, {});
}

function createTuples(instructions = '') {
    let numberOfString = 1;

    return _(instructions)
        .split('\n')
        .map(pipe(
            split('#'),
            head,
            trim,
            str => [numberOfString++, str]
        ))
        .filter(last)
        .value();
}

function checkErrors(tuples = []) {
    const errors = [];

    tuples.forEach(([line, instruction]) => {
        const [cmd, arg, ...rest] = instruction.split(' ').filter(x => x.length);
        const mnemonic = cmd.toLowerCase();

        if (mnemonic === '') return;
        if (mnemonic[mnemonic.length - 1] === ':') {
            if (arg) {
                errors.push(new VmError(line, `Label must not have any arguments`));
            }
            return;
        }
        if (!isCommand(mnemonic)) {
            errors.push(new VmError(line, `Unknown opcode "${mnemonic}"`));
            return;
        }
        if (rest.length > 0) {
            errors.push(new VmError(line, `Command "${mnemonic}" has only one argument`));
            return;
        }
        if (arg === undefined && !isNarrowCommand(mnemonic)) {
            errors.push(new VmError(line, `Command "${mnemonic}" must have an arguments`));
            return;
        }
        if (arg !== undefined && !isWideCommand(mnemonic)) {
            errors.push(new VmError(line, `Command "${mnemonic}" must not have arguments`));
            return;
        }
    });

    return errors;
}

export function parser(instructions, opts = {}) {
    let hasErrors = false;

    const options = Object.assign({}, { debug: false, breakpoints: null }, opts);
    const vm = new VM(options);

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