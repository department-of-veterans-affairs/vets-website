import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { resetUserSession } from '../../util/helpers';

const SmRouteNavigationGuard = ({
  when,
  onConfirmButtonClick,
  onCancelButtonClick,
  modalTitle,
  modalText,
  confirmButtonText,
  cancelButtonText,
}) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [modalVisible, updateModalVisible] = useState(false);

  const closeModal = () => {
    setIsBlocking(true); // Keep blocking navigation if the user closes modal
    updateModalVisible(false);
  };

  const handleConfirm = useCallback(
    e => {
      setIsBlocking(true); // Keep blocking navigation if the user chooses to stay on page
      onConfirmButtonClick(e);
      updateModalVisible(false);
    },
    [onConfirmButtonClick],
  );

  const handleCancel = useCallback(
    async e => {
      await setIsBlocking(false); // stop blocking navigation if the user chooses to cancel changes and leave page
      onCancelButtonClick(e);
    },
    [onCancelButtonClick],
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

  const localStorageValues = useMemo(() => {
    return {
      atExpires: localStorage.atExpires,
      hasSession: localStorage.hasSession,
      sessionExpiration: localStorage.sessionExpiration,
      userFirstName: localStorage.userFirstName,
    };
  }, []);

  const { signOutMessage, timeoutId } = resetUserSession(localStorageValues);

  const noTimeout = useCallback(
    () => {
      clearTimeout(timeoutId);
    },
    [timeoutId],
  );

  const beforeUnloadHandler = useCallback(
    e => {
      e.preventDefault();
      window.onbeforeunload = () => signOutMessage;
      e.returnValue = signOutMessage; // Included for legacy support, e.g. Chrome/Edge < 119
    },
    [signOutMessage],
  );

  // Update blocking state based on the `when` prop
  useEffect(
    () => {
      setIsBlocking(when);

      // beforeunload prevents the user from navigating away from the page
      // without saving their work. This is a browser feature and cannot be
      // disabled. The message displayed to the user is also a browser feature
      if (when) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
      } else {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        noTimeout();
      }
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        noTimeout();
      };
    },
    [when, beforeUnloadHandler, noTimeout],
  );

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <div
        data-testid="navigation-guard"
        data-navigation-blocked={when.toString()}
        hidden
      />
      <VaModal
        modalTitle={modalTitle}
        modalText={modalText}
        onCloseEvent={closeModal}
        status="warning"
        visible={modalVisible}
        data-dd-action-name="SM Route Navigation Guard Close Modal Button"
        data-testid="sm-route-navigation-guard-modal"
      >
        <p>{modalText}</p>
        <va-button
          class="vads-u-margin-top--1"
          text={confirmButtonText}
          onClick={handleConfirm}
          data-dd-action-name="SM Route Navigation Guard Confirm Button"
          data-testid="sm-route-navigation-guard-confirm-button"
        />
        <va-button
          class="vads-u-margin-top--1"
          secondary
          text={cancelButtonText}
          onClick={handleCancel}
          data-dd-action-name="SM Route Navigation Guard Cancel Button"
          data-testid="sm-route-navigation-guard-cancel-button"
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
  onCancelButtonClick: PropTypes.func,
  onConfirmButtonClick: PropTypes.func,
};

export default SmRouteNavigationGuard;
