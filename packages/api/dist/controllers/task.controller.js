"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.continueTask = exports.removeTask = exports.getTask = exports.getTaskStatus = exports.listOfTasks = exports.createTask = exports.getTaskById = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _parser = require("@vm-parser/parser");

var store = _interopRequireWildcard(require("../services/store.service"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getTaskById = function getTaskById(req, res, next, id) {
  var task = store.getTask(id);

  if (task) {
    req.task = task;
    req.taskId = id;
    return next();
  }

  res.status(404).send({
    message: "Task with id - ".concat(id, " not found")
  });
};

exports.getTaskById = getTaskById;

var createTask = function createTask(req, res) {
  var _req$body = req.body,
      code = _req$body.code,
      debug = _req$body.debug,
      breakpoints = _req$body.breakpoints;
  var id = (0, _v["default"])();
  var parserObj = (0, _parser.parser)(code, {
    debug: debug,
    breakpoints: breakpoints
  });
  store.setTask(id, parserObj);

  try {
    parserObj.parse();
  } catch (err) {
    return res.status(400).json({
      errors: err
    });
  }

  parserObj.interpret().then();
  res.send({
    id: id
  });
};

exports.createTask = createTask;

var listOfTasks = function listOfTasks(req, res) {
  res.send(store.getTaskStatuses());
};

exports.listOfTasks = listOfTasks;

var getTaskStatus = function getTaskStatus(req, res) {
  res.send({
    id: req.taskId,
    status: req.task.getStatus().status
  });
};

exports.getTaskStatus = getTaskStatus;

var getTask = function getTask(req, res) {
  var taskStatus = req.task.getStatus();

  switch (taskStatus.status) {
    case _parser.COMPLETED:
    case _parser.WAITING:
      res.send(taskStatus);
      break;

    case _parser.INPROGRESS:
      res.status(409).json(taskStatus);
      break;

    default:
      res.status(500).end();
      break;
  }
};

exports.getTask = getTask;

var removeTask = function removeTask(req, res) {
  var taskStatus = req.task.getStatus();

  switch (taskStatus.status) {
    case _parser.COMPLETED:
    case _parser.FAILED:
    case _parser.WAITING:
      store.removeTask(req.taskId);
      res.status(200).end(req.taskId);
      break;

    case _parser.INPROGRESS:
      res.status(409).end();
      break;

    default:
      res.status(500).end();
      break;
  }
};

exports.removeTask = removeTask;

var continueTask = function continueTask(req, res) {
  var task = req.task;
  var taskStatus = task.getStatus().status;

  if (taskStatus.status !== _parser.WAITING) {
    task.next();
    return res.end();
  }

  res.status(409).end(taskStatus);
};

exports.continueTask = continueTask;