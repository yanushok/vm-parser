import React from "react";

import Button from "components/Button";
import { useGlobalState } from "contexts/state";
import TasksApi from "services/tasksApi";
import { deleteAction } from "actions/taskActions";

function TaskList() {
    const { state, dispatch } = useGlobalState();
    
    const onDelete = id => e => {
        TasksApi
            .deleteTask(id)
            .then(deleteAction)
            .then(dispatch);
    }

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
                        <td>{task.id}</td>
                        <td>{task.status}</td>
                        <td>
                            <Button onClick={onDelete(task.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>;
    }
}

export default TaskList;