import { isNumber } from "lodash";

class Commands {
    constructor(stack, functions, emitter, options) {
        this.stack = stack;
        this.functions = functions;
        this.emitter = emitter;
        this.options = options;
    }

    end() {
        this.emitter.emit('finish', {
            dataStack: this.stack.getState()
        });
    }

    ret(fnName) {
        this.emitter.emit('ret', {
            dataStack: this.stack.getState(),
            fromFunction: fnName
        });
    }

    async call(fnName) {
        const fn = this.functions[fnName];
        const executor = new FunctionExecutor(fnName, fn, this.options);
        // executor.execute(this);
        await executor.execute(this);
        console.log('azazazazazaza')
    }

    push(arg, context) {
        if (isNumber(arg)) {
            this.stack.push(arg);
        } else {
            console.log('push: ', context, arg);
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
            this.emitter.emit(fnName, value);
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
    constructor(fnName, cmds, { debug, breakpoints }) {
        this.cmds = cmds;
        this.fnName = fnName;
        this.localScope = {};

        this.debug = debug;
        this.breakpoints = breakpoints;

        // console.log(this.cmds);
    }

    async execute(actions) {
        let counter = 0;

        for (let i = 0; i < this.cmds.length; i++) {
            await new Promise((resolve, reject) => {
                // if (this.degug) {
                //     actions.on('next', resolve);
                // } else {
                //     resolve();
                // }
                setTimeout(resolve, 3000); 
            });

            const [globalStringNumber, cmd] = this.cmds[i];
            console.log(cmd, counter);
            console.log(actions[cmd.value]);

            // if (counter === 6) {
            //     return;
            // }
            counter++;

            if (cmd.type === 'label') continue;

            if (cmd.value.includes('if')) {
                if (actions[cmd.value]()) {
                    const label = this.cmds
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
