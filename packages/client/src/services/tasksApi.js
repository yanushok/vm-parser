import axios from 'axios';

const provideData = ({ data }) => data;

export default class TasksApi {
    static fetchTasks() {
        return axios.get('http://localhost:8080/api/task').then(provideData);
    }

    static deleteTask(id) {
        return axios.delete(`http://localhost:8080/api/task/${id}`).then(provideData);
    }

    static addTask(data) {
        return axios.post(`http://localhost:8080/api/task/`, data).then(provideData);
    }

    static getTask(id) {
        return axios.get(`http://localhost:8080/api/task/${id}`).then(provideData);
    }

    static continue(id) {
        return axios.post(`http://localhost:8080/api/continue/${id}`).then(provideData);
    }
}
