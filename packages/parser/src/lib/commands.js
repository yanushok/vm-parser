import EventEmitter from 'events';
import { isNumber } from "lodash";

class Commands extends EventEmitter {
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
        executor.execute(this).then();
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

    async execute(actions) {
        for (let i = 0; i < this.commands.length; i++) {
            console.log('before execute:');

            const res = await new Promise((resolve, reject) => {
                console.log('inside promise');
                if (true) {
                    actions.on('next', resolve);
                } else {
                    resolve();
                }    
            });
            
            console.log('execute:');

            const cmd = this.commands[i];

            if (cmd.type === 'label') continue;

            if (cmd.value.includes('if')) {
                if (actions[cmd.value]()) {
                    const label = this.commands
                        .filter(x => x.type === 'label')
                        .find(x => x.value === cmd.arg + ':');

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

export default Commands;
