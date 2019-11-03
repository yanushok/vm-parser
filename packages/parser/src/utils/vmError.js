export default class VmError {
    constructor(line, msg) {
        this.line = line;
        this.msg = msg;
    }

    toString() {
        return `LINE: ${this.line}, MESSAGE: ${this.msg}`;
    }
}
