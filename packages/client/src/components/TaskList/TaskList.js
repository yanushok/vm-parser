import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import Button from "components/Button";
import ButtonGroup from "components/ButtonGroup";

import './TaskList.scss';

function TaskList({ tasks }) {
    let content = null;
    const history = useHistory();

    const addTaskHandler = useCallback(() => {
        history.push('/add-task');
    }, [history]);

    if (!tasks || tasks.length === 0) {
        content = <h3>There are not tasks yet</h3>;
    } else {
        content = <table className="table">
            <thead>
                <tr>
                    <th>Task ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.status}</td>
                        <td>
                            <ButtonGroup>
                                <Button>Delete</Button>
                                {task.status === 'WAITING' && <Button>Continue</Button>}
                            </ButtonGroup>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>;
    }

    return (
        <>
            {content}
            <Button onClick={addTaskHandler}>Add new task</Button>
        </>
    );
}

export default TaskList;