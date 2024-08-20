import React, { useEffect, useState, useCallback } from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const NavigationGuardTest = ({
  when,
  // onCancelNavigation,
  onConfirmNavigation,
  modalTitle,
  modalText,
  confirmButtonText,
  cancelButtonText,
}) => {
  const [isBlocking, setIsBlocking] = useState(false);
  // const [nextLocation, setNextLocation] = useState(null);
  const [modalVisible, updateModalVisible] = useState(false);
  // const history = useHistory();
  // console.log('isBlocking', isBlocking);
  // Handle blocking navigation
  // useEffect(
  //   () => {
  //     const unblock = history.block(location => {
  //       if (isBlocking) {
  //         setNextLocation(location);
  //         return false; // Block navigation
  //       }
  //       return true; // Allow navigation
  //     });

  //     // Cleanup the block when the component unmounts or state changes
  //     return () => {
  //       unblock();
  //     };
  //   },
  //   [isBlocking, history],
  // );

  // Update blocking state based on the `when` prop
  useEffect(
    () => {
      setIsBlocking(when);
    },
    [when],
  );

  const closeModal = () => {
    setIsBlocking(true);
    updateModalVisible(false);
  };

  const handleConfirm = useCallback(
    e => {
      // setIsBlocking(false);
      onConfirmNavigation(e);
      // if (nextLocation) {
      // history.push(nextLocation.pathname);
      // }
    },
    [onConfirmNavigation],
  );

  const handleCancel = useCallback(
    () => {
      // e.preventDeafult();
      setIsBlocking(true); // Keep blocking if the user cancels
      // setNextLocation(null); // Clear the next location to prevent navigation
      updateModalVisible(false);
      // onCancelNavigation();
    },
    [modalVisible],
  );

  const handleBlockedNavigation = useCallback(
    () => {
      if (isBlocking) {
        updateModalVisible(true);
        setIsBlocking(false);
        return false;
      }
      // setIsModalVisible(false)
      return true;
    },
    [isBlocking, setIsBlocking, updateModalVisible],
  );

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <VaModal
        modalTitle={modalTitle}
        onCloseEvent={closeModal}
        status="warning"
        visible={modalVisible}
        // data-dd-action-name="Navigation Warning Modal Closed"
      >
        <p>{modalText}</p>
        <va-button
          class="vads-u-margin-top--1"
          text={confirmButtonText}
          onClick={handleConfirm}
          // data-dd-action-name="Cancel Navigation Continue Editing Button"
        />
        <va-button
          class="vads-u-margin-top--1"
          secondary
          text={cancelButtonText}
          onClick={handleCancel}
          // data-dd-action-name="Confirm Navigation Leaving Button"
        />
      </VaModal>
    </>
  );
};

NavigationGuardTest.propTypes = {
  when: PropTypes.bool.isRequired,
  onCancelNavigation: PropTypes.func,
  onConfirmNavigation: PropTypes.func,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
};

export default NavigationGuardTest;
