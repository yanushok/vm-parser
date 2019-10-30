class Superviser {
    constructor() {
        this._mainStack = [];
    }

    pop() {
        return this._mainStack.pop();
    }

    push(val) {
        return this._mainStack.push(val);
    }

    getState() {
        return this._mainStack;
    }
}

export default Superviser;
