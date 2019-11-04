import EventEmitter from 'events';
import { pipe, trim, split, head, last } from "lodash/fp";
import _ from 'lodash';

import Node from './node';
import Superviser from './superviser';
import VmError from '../utils/vmError';
import { isCommand, isNarrowCommand, isWideCommand } from "../utils/commands";

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
        return {
            ...state,
            [functionName]: commands.map(([numOfString, cmdString], i) => [numOfString, new Node(cmdString, i, numOfString)])
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
        if (mnemonic[mnemonic.length - 1] === ':') return;
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
    let tuples = [];
    let functionsObject = {};
    let hasErrors = false;

    const emitter = new EventEmitter();
    const mainStack = new Superviser();
    const options = Object.assign({}, { debug: false, breakpoints: null }, opts);

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