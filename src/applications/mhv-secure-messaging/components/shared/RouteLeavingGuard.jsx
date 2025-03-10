import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorMessages } from '../../util/constants';

export const RouteLeavingGuard = ({
  navigate,
  when,
  shouldBlockNavigation,
  title,
  p1,
  p2,
  setIsModalVisible,
  confirmButtonText,
  cancelButtonText,
  saveDraftHandler,
  savedDraft,
  saveError,
  setSetErrorModal,
  confirmButtonDDActionName = 'Confirm Navigation Leaving Button',
  cancelButtonDDActionName = 'Cancel Navigation Continue Editing Button',
}) => {
  const [lastLocation, updateLastLocation] = useState();
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false);
  const [modalVisible, updateModalVisible] = useState(false);

  const showModal = location => {
    setIsModalVisible(true);
    updateModalVisible(true);
    updateLastLocation(location);
  };

  const closeModal = () => {
    updateModalVisible(false);
    setSetErrorModal(false);
  };

  const handleBlockedNavigation = nextLocation => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      showModal(nextLocation);
      updateModalVisible(true);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    const isConfirmButtonTextMatching = confirmButtonText.includes('Save');

    if (isConfirmButtonTextMatching) {
      saveDraftHandler('manual');
    }
    closeModal();
    if (lastLocation) {
      updateConfirmedNavigation(true);
    }
  };

  const handleCancelNavigationClick = e => {
    setIsModalVisible(false);
    updateModalVisible(false);
    setSetErrorModal(false);

    const isCancelButtonTextMatching =
      cancelButtonText ===
        ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.cancelButtonText ||
      cancelButtonText ===
        ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.cancelButtonText;

    if (isCancelButtonTextMatching) {
      saveDraftHandler('manual', e);
    }
  };

  useEffect(
    () => {
      if (confirmedNavigation) {
        navigate(lastLocation.pathname);
        updateConfirmedNavigation(false);
      }
    },
    [confirmedNavigation],
  );

  useEffect(
    () => {
      if (savedDraft && !!saveError) {
        updateModalVisible(true);
      }
    },
    [saveError, savedDraft],
  );

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <VaModal
        modalTitle={title}
        onCloseEvent={() => {
          closeModal();
          datadogRum.addAction('Navigation Warning Modal Closed');
        }}
        status="warning"
        visible={modalVisible}
        data-dd-action-name="Navigation Warning Modal"
        data-testid="navigation-warning-modal"
      >
        <p>
          {cancelButtonText !==
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
              .confirmButtonText && p1}
        </p>
        {p2 && <p>{p2}</p>}
        <div className="mobile-lg:vads-u-flex-direction--row">
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            text={cancelButtonText}
            onClick={handleCancelNavigationClick} // need to pass a func to save draft
            data-dd-action-name={cancelButtonDDActionName}
          />
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            secondary
            text={confirmButtonText}
            onClick={handleConfirmNavigationClick}
            data-dd-action-name={confirmButtonDDActionName}
          />
        </div>
      </VaModal>
    </>
  );
};

RouteLeavingGuard.propTypes = {
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  modalVisible: PropTypes.bool,
  navigate: PropTypes.func,
  p1: PropTypes.string,
  p2: PropTypes.any,
  saveDraftHandler: PropTypes.func,
  saveError: PropTypes.object,
  savedDraft: PropTypes.bool,
  setIsModalVisible: PropTypes.func,
  setSetErrorModal: PropTypes.func,
  shouldBlockNavigation: PropTypes.func,
  title: PropTypes.string,
  updateModalVisible: PropTypes.func,
  when: PropTypes.bool,
};

export default RouteLeavingGuard;
