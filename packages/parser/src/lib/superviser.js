export const WAITING = 'WAITING';
export const COMPLETED = 'COMPLETED';
export const FAILED = 'FAILED';
export const INPROGRESS = 'INPROGRESS';

class Superviser {
    constructor() {
        this._mainStack = [];
        this._functionsStack = [];

        this._status = INPROGRESS;
    }

    pop() {
        return this._mainStack.pop();
    }

    push(val) {
        this._mainStack.push(val);
    }

    getState() {
        return this._mainStack;
    }

    pushFunction(fnName, commandString) {
        this._functionsStack.push({ fnName, commandString });
    }

    popFunction() {
        return this._functionsStack.pop();
    }

    getStatus() {
        return this._status;
    }

    setStatus(status) {
        setTimeout(() => {
            this._status = status
        }, 0);
    }
}

export default Superviser;
