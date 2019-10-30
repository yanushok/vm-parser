"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _parser = require("../controllers/parser.controller");

var router = (0, _express.Router)();
router.get('/task', function (req, res) {
  res.status(200).send('/task');
});
router.route('/task/:id').get(function (req, res) {
  res.status(200).send("/task/".concat(req.params.id));
}).post(function (req, res) {})["delete"](function (req, res) {});
router.post('/continue/:id', function (req, res) {});
router.get('/status/:id', function (req, res) {});
router.post('/parse', _parser.parseVmCode);
var _default = router;
exports["default"] = _default;