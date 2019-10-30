"use strict";

var _debug = _interopRequireDefault(require("debug"));

var _http = _interopRequireDefault(require("http"));

var _config = require("./config");

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_app["default"].set('port', _config.PORT);

var debug = (0, _debug["default"])('vm-parse:api');

var server = _http["default"].createServer(_app["default"]);

server.listen(_config.PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof _config.PORT === 'string' ? "Pipe ".concat(_config.PORT) : "Port ".concat(_config.PORT);

  switch (error.code) {
    case 'EACCES':
      debug("".concat(bind, " requires elevated privileges"));
      process.exit(1);
      break;

    case 'EADDRINUSE':
      debug("".concat(bind, " is already in use"));
      process.exit(1);
      break;

    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? "pipe ".concat(addr) : "port ".concat(addr.port);
  debug("Listening on ".concat(bind));
}