import React from 'react';
import TaskList from 'components/TaskList';

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

function MainPage() {
    return (
        <>
            <TaskList tasks={tasks} />
        </>
    );
}

export default MainPage;
