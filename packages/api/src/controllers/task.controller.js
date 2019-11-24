import uuid4 from 'uuid/v4';
import { parser, INPROGRESS, COMPLETED, WAITING, FAILED } from "@vm-parser/parser";
import * as store from "../services/store.service";

export const getTaskById = (req, res, next, id) => {
    const task = store.getTask(id);

    if (task) {
        req.task = task;
        req.taskId = id;
        return next();
    }

    res.status(404).send({
        message: `Task with id - ${id} not found`
    });
};

export const createTask = (req, res) => {
    const { code, debug, breakpoints } = req.body;
    const id = uuid4();
    const parserObj = parser(code, { debug, breakpoints });

    store.setTask(id, parserObj);

    try {
        parserObj.parse();
    } catch (err) {
        return res.status(400).json({ errors: err });
    }

    parserObj.interpret().then();
    res.send({ id });
};

export const listOfTasks = (req, res) => {
    res.send(store.getTaskStatuses());
};

export const getTaskStatus = (req, res) => {
    res.send({
        id: req.taskId,
        status: req.task.getStatus().status
    });
};

export const getTask = (req, res) => {
    const taskStatus = req.task.getStatus();
    switch (taskStatus.status) {
        case COMPLETED:
        case WAITING:
            res.send(taskStatus);
            break;
        case INPROGRESS:
            res.status(409).json(taskStatus);
            break;
        default:
            res.status(500).end();
            break;
    }
};

export const removeTask = (req, res) => {
    const taskStatus = req.task.getStatus();
    switch (taskStatus.status) {
        case COMPLETED:
        case FAILED:
        case WAITING:
            store.removeTask(req.taskId);
            res.status(200).json({ id: req.taskId });
            break;
        case INPROGRESS:
            res.status(409).end();
            break;
        default:
            res.status(500).end();
            break;
    }
};

export const continueTask = (req, res) => {
    const task = req.task;
    const taskStatus = task.getStatus().status;

    if (taskStatus.status !== WAITING) {
        task.next();
        return res.end();
    }

    res.status(409).end(taskStatus);
}; 
