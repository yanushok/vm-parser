import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null
};

const createList = obj => {
    return Object.keys(obj).reduce((arr, key) => {
        arr.push({ id: key, status: obj[key] });
        return arr;
    }, []);
};

const reducer = (state, action) => {
    console.log('reducer', state, action);

    switch (action.type) {
        case 'FETCHING':
            return { ...state, loading: true };
        case 'SUCCESS':
            return { ...state, loading: false, error: null, data: createList(action.payload) };
        default:
            return state;
    }
};

const toJson = res => res.json();
const fetchingAction = () => ({ type: 'FETCHING' });
const successAction = data => {
    console.log(data);
    return { type: 'SUCCESS', payload: data };
};
const errorAction = data => {
    console.log('errorAction', data);
    return { type: 'FAILURE' };
};

const useRequest = (s) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const request = useCallback((url, method, params = null) => {
        dispatch(fetchingAction());
        fetch(url, {
            method,
            mode: 'cors',
            body: params && JSON.stringify(params)
        })
            .then(toJson)
            .then(successAction)
            .catch(errorAction)
            .then(dispatch);
    }, []);

    return [state, request];
}

export {
    useRequest
}