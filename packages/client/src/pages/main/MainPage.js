import React, { useEffect } from 'react';
import TaskList from 'components/TaskList';
import { useRequest } from 'hooks/useRequest';

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
    const [{ data }, request] = useRequest();
    console.log('state', data);

    const onRefresh = () => {
        request('http://localhost:8080/api/task', 'GET');
    };

    useEffect(() => {
        request('http://localhost:8080/api/task', 'GET');
    }, []);

    return (
        <>
            <TaskList tasks={data} onRefresh={onRefresh} />
        </>
    );
}

export default MainPage;
