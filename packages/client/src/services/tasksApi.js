import axios from 'axios';

export default class TasksApi {
    static fetchTasks() {
        return axios.get('http://localhost:8080/api/task');
    }

    static deleteTask(id) {
        return axios.delete(`http://localhost:8080/api/task/${id}`);
    }

    static addTask(data) {
        return axios.post(`http://localhost:8080/api/task/`, data);
    }
}
