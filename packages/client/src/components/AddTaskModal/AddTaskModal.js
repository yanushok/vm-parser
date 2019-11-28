import React, { useState, useCallback } from 'react';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import { Modal, ModalFooter, ModalBody } from "components/Modal";

function AddTaskModal({ isOpen, onCloseModal, onSave }) {
    const [code, setCode] = useState('');
    const [breakpoints, setBreakpoints] = useState('');
    const [isDebug, setDebug] = useState(false);
    const [errors, setErrors] = useState([]);

    const onCodeChange = useCallback(e => setCode(e.target.value), []);
    const onDebugChange = useCallback(e => setDebug(e.target.checked), []);
    const onBreakpointsChange = useCallback(e => setBreakpoints(e.target.value), []);

    const onSubmit = e => {
        setErrors([]);
        e.preventDefault();

        if (code.trim() === '') {
            return;
        }

        const data = {
            code: code.trim(),
            debug: isDebug,
            breakpoints: breakpoints ? breakpoints.split(',').map(Number) : null
        };

        onSave(data, null, (err) => {
            setErrors(err.response.data.errors);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCloseModal}
        >
            <ModalBody>
                <form className="add-task-form">
                    <div className="form-group add-task-form__codearea">
                        <textarea value={code} onChange={onCodeChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label className="add-task-form__debug-mode">
                            Debug mode
                            <input type="checkbox" name="debug" checked={isDebug} onChange={onDebugChange} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="add-task-form__breakpoints">
                            Breakpoints
                            <input type="text" placeholder="Example: 1, 10, 18" name="breakpoints" value={breakpoints} onChange={onBreakpointsChange} />
                        </label>
                    </div>
                    <div className="form-group">
                        <ul className="add-task-form__errors">
                            {!!errors.length && errors.map((err, i) => (
                                <li key={i}>{`${err.msg} on line ${err.line}`}</li>
                            ))}
                        </ul>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    <Button disabled={code.trim() === ''} onClick={onSubmit}>Save</Button>
                    <Button onClick={onCloseModal}>Close</Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    );
}

export default AddTaskModal;
