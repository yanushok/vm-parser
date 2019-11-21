import React from "react";

import Button from "components/Button";
import ButtonGroup from "components/ButtonGroup";

import './TaskList.scss';

const tasks = [{
    id: 'asdhs-s dfjs d-sdf',
    status: 'COMPLETED'
}, {
    id: 'asdhs-s d-sdf',
    status: 'FAILED'
}, {
    id: 'asdhs-s dfjs',
    status: 'WAITING'
}];

function TaskList() {
    return (
        <div className="container">
            <table className="table">
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
            </table>
            <Button>Add new task</Button>
        </div>
    );
}

export default TaskList;