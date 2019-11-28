import React, { useState, useCallback, useEffect } from 'react';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import { Modal, ModalFooter, ModalBody } from "components/Modal";
import TasksApi from 'services/tasksApi';

function ShowTaskModal({ isOpen, onCloseModal, onContinue, taskId }) {
    const [task, setTask] = useState(null);

    const continueHandler = useCallback(() => {
        onContinue(taskId);
    }, [onContinue, taskId]);

    useEffect(() => {
        TasksApi
            .getTask(taskId)
            .then(setTask);
    }, [taskId]);

    let body = null;

    if (!task) {
        body = <div>Loading...</div>;
    } else {
        console.log(task);
        body = <div className="task-content">
            <div className="task-content__row">Id: {taskId}</div>
            <div className="task-content__row">Status: {task.status}</div>
            {task.stack && <div className="task-content__row">Stack: [{task.stack.join(', ')}]</div>}
            {task.result && <div className="task-content__row">Result: {task.result}</div>}
        </div>
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCloseModal}
        >
            <ModalBody>
                {body}
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    {task && task.status === "WAITING" && <Button onClick={continueHandler}>Continue</Button>}
                    <Button onClick={onCloseModal}>Close</Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    );
}

export default ShowTaskModal;
