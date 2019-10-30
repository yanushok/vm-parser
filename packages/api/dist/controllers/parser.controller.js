"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseVmCode = void 0;

var _parser = require("@vm-parser/parser");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseVmCode = function parseVmCode(req, res) {
  var parserObj = (0, _parser.parser)(req.body.instructions);
  var response = {};
  parserObj.subscribe('out', function (result) {
    response.out = result;
  });
  parserObj.interpret().then(function (data) {
    response = _objectSpread({}, response, {}, data);
    res.json(response);
  })["catch"](function (e) {
    return console.log(e);
  });
};

exports.parseVmCode = parseVmCode;