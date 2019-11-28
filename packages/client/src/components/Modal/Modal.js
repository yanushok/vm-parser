import React from 'react'
import ReactModal from "react-modal";

export const ModalBody = ({ children }) => <div className="task-modal__body">{ children }</div>;
export const ModalFooter = ({ children }) => <div className="task-modal__footer">{ children }</div>;

ReactModal.setAppElement('#root')

export function Modal({ children, ...rest }) {
    return (
        <ReactModal
            className="task-modal"
            overlayClassName="task-modal__overlay"
            { ...rest }
        >
            { children }
        </ReactModal>
    );
}
