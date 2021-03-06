"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API_PATH = '/api';
var app = (0, _express["default"])();
var isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  app.use((0, _morgan["default"])('dev'));
}

app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(API_PATH, _routes["default"]);
var _default = app;
exports["default"] = _default;