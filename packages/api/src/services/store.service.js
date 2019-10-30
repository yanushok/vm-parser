const store = new Map();

export function getTask(id) {
    return store.get(id);
}

export function setTask(id, taskInstance) {
    store.set(id, taskInstance);
}

export function removeTask(id) {
    store.delete(id);
}

export function hasTask(id) {
    return store.has(id);
}