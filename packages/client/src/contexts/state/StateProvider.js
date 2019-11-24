import React, { useReducer } from 'react'

import StateContext from "./StateContext";

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
    switch (action.type) {
        case 'DELETE_SUCCESS':
            const data = state.data.filter(el => el.id !== action.payload);
            return { ...state, loading: false,  data };
        case 'REQUESTING':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: null, data: createList(action.payload) };
        default:
            return state;
    }
};

function StateProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    );
}

export default StateProvider;
