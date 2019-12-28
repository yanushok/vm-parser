import {
  pipe, split, map, trim,
} from 'lodash/fp';

export const LABEL = 'LABEL';
export const COMMAND = 'COMMAND';

class Node {
  constructor(value, localString, globalString) {
    const [cmd, arg] = pipe(
      split(' '),
      map(trim),
    )(value);

    this.value = cmd;
    this.localString = localString;
    this.globalString = globalString;

    if (this.value.includes(':')) {
      this.type = LABEL;
      this.value = this.value.split(':')[0];
    } else {
      this.type = COMMAND;
    }

    if (isNaN(Number(arg))) {
      this.arg = arg || null;
    } else {
      this.arg = Number(arg);
    }
  }
}

export default Node;
