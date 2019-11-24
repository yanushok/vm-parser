import React, { useState, useCallback } from 'react';
import Modal from "react-modal";
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';

function AddTaskModal({ isOpen, onCloseModal, onSave }) {
    const [code, setCode] = useState('');

    const onChange = useCallback(e => setCode(e.target.value.trim()), []);

    const onSubmit = e => {
        e.preventDefault();
        onSave({ code });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCloseModal}
        >
            <form className="add-task__form" onSubmit={onSubmit}>
                <textarea className="add-task__codearea" value={code} onChange={onChange}></textarea>

                <ButtonGroup>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCloseModal}>Close</Button>
                </ButtonGroup>
            </form>
        </Modal>
    );
}

export default AddTaskModal;