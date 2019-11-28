import EventEmitter from "events";
import { isNumber } from "lodash";

import { LABEL } from "./node";
import VmError from "../utils/vmError";
import Superviser from "./superviser";

export const WAITING = 'WAITING';
export const COMPLETED = 'COMPLETED';
export const FAILED = 'FAILED';
export const INPROGRESS = 'INPROGRESS';

class VMFunction {
    constructor(name, commands = [], { debug, breakpoints }) {
        this.name = name;
        this.commands = commands;

        this.commandsLength = this.commands.length;
        this.ip = 0;
        this.localScope = {};

        this.debug = debug;
        this.breakpoints = breakpoints;

        this.id = Math.round(Math.random() * 50);
    }

    execute(actions) {
        while (this.ip < this.commandsLength) {
            this.oneStep(actions);
            if (this.debug) {
                const cmd = this.commands[this.ip++];

                if (this.breakpoints) {
                    if (this.breakpoints.includes(cmd.globalString)) {
                        return;
                    }
                } else {
                    return;
                }
            } else {
                this.ip++;
            }
        }
    }

    oneStep(actions) {
        const cmd = this.commands[this.ip];

        if (cmd.type === LABEL) return;

        if (cmd.value.includes('if')) {
            if (actions[cmd.value]()) {
                this.ip = this.findStringByLabel(cmd.arg, cmd.globalString);
                return;
            }
        } else if (cmd.value.includes('ret')) {
            actions[cmd.value](this.fnName);
        } else {
            actions[cmd.value](cmd.arg, this.localScope);
        }
    }

    findStringByLabel(label, numberOfString) {
        const foundedLabel = this.commands
            .filter(cmd => cmd.type === LABEL)
            .find(cmd => cmd.value === `${label}`);

        if (foundedLabel) {
            return foundedLabel.localString;
        }

        throw new VmError(numberOfString, `Label "${label}" not found`);
    }
}

class VM extends EventEmitter {
    constructor(options) {
        super();

        this.stack = new Superviser();
        this.functions = {};
        this.options = options;

        this.currentFunction = null;

        this.status = WAITING;
        this.result = null;
    }

    setFunctions(functions) {
        this.functions = functions;
    }

    getStatus() {
        const status = {
            status: this.status
        };

        if (this.status === WAITING) {
            status.stack = this.stack.getState();
        } else if(this.status === COMPLETED) {
            status.result = this.result;
        } else if(this.status === INPROGRESS) {
            status.err = 'Task in progress at the moment'
        }

        return status;
    }

    execute(fnName) {
        const fn = this.functions[fnName];
        this.currentFunction = new VMFunction(fnName, fn.commands, this.options);
        this.currentFunction.execute(this);
        this.setStatus(WAITING);
    }

    start() {
        this.setStatus(INPROGRESS);

        try {
            this.call('main');
        } catch (error) {
            this.setStatus(FAILED);
            throw error;
        }
    }

    next() {
        if (this.status !== WAITING) {
            return this.status;
        } else {
            this.setStatus(INPROGRESS);
            this.currentFunction.execute(this);
            this.setStatus(WAITING);
        }

        return this.status;
    }

    setStatus(status) {
        if (this.status !== COMPLETED && this.status !== FAILED) {
            this.status = status;
        }
    }

    end() {
        this.emit('finish', {
            dataStack: this.stack.getState()
        });

        this.result = this.stack.pop();
        this.setStatus(COMPLETED);
    }

    ret() {
        this.currentFunction = this.stack.popFunction();
    }

    call(fnName) {
        if (this.currentFunction) {
            this.stack.pushFunction(this.currentFunction);
        }
        this.execute(fnName);
    }

    push(arg, context) {
        if (isNumber(arg)) {
            this.stack.push(arg);
        } else {
            this.stack.push(context[arg]);
        }
    }

    pop(arg, context) {
        const value = this.stack.pop();
        context[arg] = value;
    }

    dup(arg, context) {
        const temp = this.stack.pop();
        this.push(temp, context);
        this.push(temp, context);
    }

    add(arg, context) {
        const right = this.stack.pop();
        const left = this.stack.pop();
        this.push(left + right, context);
    }

    sub(arg, context) {
        const right = this.stack.pop();
        const left = this.stack.pop();
        this.push(left - right, context);
    }

    mul(arg, context) {
        const right = this.stack.pop();
        const left = this.stack.pop();
        this.push(left * right, context);
    }

    div(arg, context) {
        const right = this.stack.pop();
        const left = this.stack.pop();
        this.push(Math.round(left / right), context);
    }

    callext(fnName) {
        const value = this.stack.getTopValue();
        if (this.eventNames().includes(fnName)) {
            this.emit(fnName, value);
        }
    }

    ifeq() {
        const right = this.stack.pop();
        const left = this.stack.pop();

        return left === right;
    }

    ifgr() {
        const right = this.stack.pop();
        const left = this.stack.pop();

        return left > right;
    }
}

export default VM;
