import React, { useEffect, useState, useCallback } from 'react';

import TaskList from 'components/TaskList';
import TasksApi from 'services/tasksApi';
import { fetchAction, requestingAction } from "actions/taskActions";
import { useGlobalState } from 'contexts/state';
import AddTaskModal from 'components/AddTaskModal';
import Button from "components/Button";
import ButtonGroup from "components/ButtonGroup";
import ShowTaskModal from 'components/ShowTaskModal';

function MainPage() {
    const { dispatch } = useGlobalState();
    const [addModalIsOpen, setAddModalOpen] = useState(false);
    const [showTaskModalIsOpen, setShowTaskModal] = useState(false);

    const onRefresh = useCallback(() => {
        dispatch(requestingAction());
        TasksApi
            .fetchTasks()
            .then(fetchAction)
            .then(dispatch);
    }, [dispatch]);

    const onSave = (data, onSuccess, onError) => {
        TasksApi
            .addTask(data)
            .then(onRefresh)
            .then(() => setAddModalOpen(false))
            .catch(err => onError(err));
    }

    useEffect(() => {
        onRefresh();
    }, [onRefresh]);

    const onAddModalClose = useCallback(() => setAddModalOpen(false), []);
    const onAddModalOpen = useCallback(() => setAddModalOpen(true), []);

    const onShowTaskModalClose = useCallback(() => setShowTaskModal(false), []);
    const onShowTaskModalOpen = useCallback((id) => {
        console.log(id);
        setShowTaskModal(true)
    }, []);

    return (
        <>
            <TaskList onTaskClick={onShowTaskModalOpen} />
            
            <ButtonGroup>
                <Button onClick={onAddModalOpen}>Add new task</Button>
                <Button onClick={onRefresh}>Refresh</Button>
            </ButtonGroup>

            {addModalIsOpen && <AddTaskModal isOpen={addModalIsOpen} onSave={onSave} onCloseModal={onAddModalClose} />}
            {showTaskModalIsOpen && <ShowTaskModal isOpen={showTaskModalIsOpen} onCloseModal={onShowTaskModalClose} />}
        </>
    );
}

export default MainPage;
