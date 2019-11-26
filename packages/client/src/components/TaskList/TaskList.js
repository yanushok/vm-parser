import React, { useCallback } from "react";

import Button from "components/Button";
import { useGlobalState } from "contexts/state";
import TasksApi from "services/tasksApi";
import { deleteAction } from "actions/taskActions";

function TaskList({ onTaskClick }) {
    const { state, dispatch } = useGlobalState();
    
    const deleteHandler = id => e => {
        TasksApi
            .deleteTask(id)
            .then(deleteAction)
            .then(dispatch);
    }

    const taskClickHandler = useCallback(id => e => {
        console.log('render 1');
        e.preventDefault();
        onTaskClick(id);
    }, [onTaskClick]);

    console.log('render 2');

    if (!state || !state.data || !state.data.length) {
        return <h3>There are no tasks yet</h3>;
    } else {
        return <table className="table">
            <thead>
                <tr>
                    <th>Task ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {state.data.map(task => (
                    <tr key={task.id}>
                        <td>
                            <a href="/" onClick={taskClickHandler(task.id)}>{task.id}</a>
                        </td>
                        <td>{task.status}</td>
                        <td>
                            <Button onClick={deleteHandler(task.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>;
    }
}

export default TaskList;