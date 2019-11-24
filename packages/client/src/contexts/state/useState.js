import { useContext } from 'react';
import StateContext from "./StateContext";

export default function useGlobalState() {
    return useContext(StateContext)
}
