"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCommand = isCommand;
exports.isNarrowCommand = isNarrowCommand;
exports.isWideCommand = isWideCommand;
const AvailableCommands = ['push', 'pop', 'ret', 'call', 'end', 'dup', 'add', 'sub', 'mul', 'dev', 'ifeq', 'ifgr', 'callext', 'function'];
const NarrowInstructions = ['end', 'dup', 'add', 'mul', 'sub', 'div', 'ret'];
const WideInstructions = ['push', 'pop', 'call', 'function', 'callext', 'ifeq', 'ifgr'];

function isCommand(cmd) {
  return AvailableCommands.includes(cmd);
}

function isNarrowCommand(cmd) {
  return NarrowInstructions.includes(cmd);
}

function isWideCommand(cmd) {
  return WideInstructions.includes(cmd);
}