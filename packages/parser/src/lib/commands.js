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
        // if (this.debug && this.ip < this.commandsLength) {
        //     if (this.breakpoints) {

        //     }
        //     this.oneStep(actions);
        //     this.ip++;
        // } 
        
        // if (!this.debug) {
        //     while (this.ip < this.commandsLength) {
        //         this.oneStep(actions);
        //         if (debug) {
        //             break;
        //         }
        //         this.ip++;
        //     }
        // }

        console.log('before whille', this.ip, this.id);
        while (this.ip < this.commandsLength) {
            // console.log(this.ip);
            this.oneStep(actions);
            if (this.debug) {
                const cmd = this.commands[this.ip++];
                console.log('increment: ', cmd.value, this.ip, this.id, this.name);

                if (this.breakpoints) {
                    if (this.breakpoints.includes(cmd.globalString)) {
                        console.log(this.breakpoints, this.breakpoints.includes(cmd.globalString));
                        console.log('execute: ', cmd.globalString);
                        console.log('execute: ', this.commands[this.ip]);
                        console.log('execute: ', this.ip);
                        return;
                    }
                } else {
                    return;
                }
            } else {
                this.ip++;
            }

            // this.oneStep(actions);
            // console.log('ip: ', this.ip);
            // this.ip++;
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
            // console.log(cmd.value);
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
    }

    setFunctions(functions) {
        this.functions = functions;
    }

    getStatus() {
        return this.status;
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
        console.log('setStatus: ', status);
        if (this.status !== COMPLETED && this.status !== FAILED) {
            this.status = status;
        }
    }

    end() {
        console.log('end');
        this.emit('finish', {
            dataStack: this.stack.getState()
        });

        this.setStatus(COMPLETED);
    }

    ret() {
        this.currentFunction = this.stack.popFunction();
        console.log('ID: ', this.currentFunction.id);
    }

    call(fnName) {
        console.log('this.currentFunction', this.currentFunction && this.currentFunction.id);
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
        const first = this.stack.pop();
        const second = this.stack.pop();
        this.push(first + second, context);
    }

    sub(arg, context) {
        const second = this.stack.pop();
        const first = this.stack.pop();
        this.push(first - second, context);
    }

    mul(arg, context) {
        const first = this.stack.pop();
        const second = this.stack.pop();
        this.push(first * second, context);
    }

    div(arg, context) {
        const second = this.stack.pop();
        const first = this.stack.pop();
        this.push(Math.round(first / second), context);
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

export default VM;