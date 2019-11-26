export function requestingAction() {
    return { type: 'REQUESTING' };
}

export function fetchAction({ data }) {
    return { type: 'FETCH_SUCCESS', payload: data };
}

export function deleteAction({ data }) {
    return { type: 'DELETE_SUCCESS', payload: data.id };
}
