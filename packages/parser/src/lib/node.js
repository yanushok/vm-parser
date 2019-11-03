import { pipe, split, map, trim } from "lodash/fp";

class Node {
    constructor(value, i, globalString) {
        const [cmd, arg] = pipe(
            split(' '),
            map(trim)
        )(value);

        this.value = cmd;
        this.stringNumber = i;
        this.globalString = globalString;
        
        if (this.value.includes(':')) {
            this.type = 'label';
            this.value = this.value.split(':')[0];
        } else {
            this.type = 'command';
        }

        if (isNaN(Number(arg))) {
            this.arg = arg || null;
        } else {
            this.arg = Number(arg);
        }
    }
}

export default Node;
