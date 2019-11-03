const AvailableCommands = ['push', 'pop', 'ret', 'call', 'end', 'dup', 'add', 'sub', 'mul', 'dev', 'ifeq', 'ifgr', 'callext', 'function'];
const NarrowInstructions = ['end', 'dup', 'add', 'mul', 'sub', 'div', 'ret'];
const WideInstructions = ['push', 'pop', 'call', 'function', 'callext', 'ifeq', 'ifgr'];

export function isCommand(cmd) {
    return AvailableCommands.includes(cmd);
}

export function isNarrowCommand(cmd) {
    return NarrowInstructions.includes(cmd);
}

export function isWideCommand(cmd) {
    return WideInstructions.includes(cmd);
}
