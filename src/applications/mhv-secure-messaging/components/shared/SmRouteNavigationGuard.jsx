import React, { useEffect, useState, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SmRouteNavigationGuard = ({
  when,
  onConfirmNavigation,
  modalTitle,
  modalText,
  confirmButtonText,
  cancelButtonText,
}) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [modalVisible, updateModalVisible] = useState(false);

  const closeModal = () => {
    setIsBlocking(true); // Keep blocking if the user closes modal
    updateModalVisible(false);
  };

  const handleCancel = () => {
    setIsBlocking(true); // Keep blocking if the user cancels
    updateModalVisible(false);
  };

  const handleConfirm = useCallback(
    e => {
      onConfirmNavigation(e, true); // true will force navigation and saving, and skip modal
    },
    [onConfirmNavigation],
  );

  const handleBlockedNavigation = useCallback(
    () => {
      if (isBlocking) {
        updateModalVisible(true);
        setIsBlocking(false);
        return false; // Blocks Navigation
      }
      return true; // Allows Navigation
    },
    [isBlocking, setIsBlocking, updateModalVisible],
  );

  // Update blocking state based on the `when` prop
  useEffect(
    () => {
      setIsBlocking(when);
    },
    [when],
  );

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <VaModal
        modalTitle={modalTitle}
        modalText={modalText}
        onCloseEvent={closeModal}
        status="warning"
        visible={modalVisible}
        data-dd-action-name="Navigation Warning Close Modal Button"
      >
        <p>{modalText}</p>
        <va-button
          class="vads-u-margin-top--1"
          text={confirmButtonText}
          onClick={handleConfirm}
          data-dd-action-name="Confirm Navigation Save and Exit Button"
        />
        <va-button
          class="vads-u-margin-top--1"
          secondary
          text={cancelButtonText}
          onClick={handleCancel}
          data-dd-action-name="Cancel Navigation Continue Editing Button"
        />
      </VaModal>
    </>
  );
};

SmRouteNavigationGuard.propTypes = {
  when: PropTypes.bool.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  modalText: PropTypes.string,
  modalTitle: PropTypes.string,
  onConfirmNavigation: PropTypes.func,
};

export default SmRouteNavigationGuard;
