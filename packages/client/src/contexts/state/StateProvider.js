import React, { useReducer } from 'react'

import StateContext from "./StateContext";

const initialState = {};

const reducer = (state, action) => {

};

function StateProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            { children }
        </StateContext.Provider>
    );
}

export default StateProvider;
