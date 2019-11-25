import React, { useEffect, useState } from 'react';

import TaskList from 'components/TaskList';
import TasksApi from 'services/tasksApi';
import { fetchAction, requestingAction } from "actions/taskActions";
import { useGlobalState } from 'contexts/state';
import AddTaskModal from 'components/AddTaskModal';
import Button from "components/Button";
import ButtonGroup from "components/ButtonGroup";

function MainPage() {
    const { dispatch } = useGlobalState();
    const [modalIsOpen, setOpen] = useState(false);

    const onRefresh = () => {
        dispatch(requestingAction());
        TasksApi
            .fetchTasks()
            .then(fetchAction)
            .then(dispatch);
    };

    const onSave = (data, onSuccess, onError) => {
        TasksApi
            .addTask(data)
            .then(onRefresh)
            .then(() => setOpen(false))
            .catch(err => onError(err));
    }

    useEffect(() => {
        onRefresh();
    }, []);

    const onClose = () => setOpen(false);
    const onOpen = () => setOpen(true);

    return (
        <>
            <TaskList />
            
            <ButtonGroup>
                <Button onClick={onOpen}>Add new task</Button>
                <Button onClick={onRefresh}>Refresh</Button>
            </ButtonGroup>

            {modalIsOpen && <AddTaskModal isOpen={modalIsOpen} onSave={onSave} onCloseModal={onClose} />}
        </>
    );
}

export default MainPage;
