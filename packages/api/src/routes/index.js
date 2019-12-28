import { Router } from 'express';
import * as taskController from '../controllers/task.controller';

const router = Router();

router.route('/task')
    .get(taskController.listOfTasks)
    .post(taskController.createTask);

router.route('/task/:taskId')
    .get(taskController.getTask)
    .delete(taskController.removeTask);
    
router.post('/continue/:taskId', taskController.continueTask);
router.get('/status/:taskId', taskController.getTaskStatus);

router.param('taskId', taskController.getTaskById);

export default router;