import React, { useState, useCallback } from 'react';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import { Modal, ModalFooter, ModalBody } from "components/Modal";

function ShowTaskModal({ isOpen, onCloseModal, onSave }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCloseModal}
        >
            <ModalBody>
                azazaza
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    <Button onClick={onCloseModal}>Close</Button>
                </ButtonGroup>
            </ModalFooter>
        </Modal>
    );
}

export default ShowTaskModal;