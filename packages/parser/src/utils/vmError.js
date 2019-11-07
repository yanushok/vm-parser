export default class VmError extends Error {
    constructor(line, msg) {
        super();
        this.line = line;
        this.msg = msg;
    }

    toString() {
        return `LINE: ${this.line}, MESSAGE: ${this.msg}`;
    }
}
