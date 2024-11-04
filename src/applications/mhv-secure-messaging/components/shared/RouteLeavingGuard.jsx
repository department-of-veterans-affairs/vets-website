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
  confirmButtonText,
  cancelButtonText,
  saveDraftHandler,
  setSavedDraft,
  setSaveError,
  removeModal,
}) => {
  const [lastLocation, updateLastLocation] = useState();
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false);
  const [modalVisible, updateModalVisible] = useState(false);

  const showModal = location => {
    removeModal(true);
    updateModalVisible(true);
    updateLastLocation(location);
  };

  const closeModal = cb => {
    updateModalVisible(false);
    cb();
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
    if (
      cancelButtonText ===
      ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.cancelButtonText
    ) {
      saveDraftHandler('manual');
    }
    closeModal(() => {
      if (lastLocation) {
        updateConfirmedNavigation(true);
      }
    });
  };

  const handleCancelNavigationClick = e => {
    removeModal(false);
    updateModalVisible(false);
    setSavedDraft(false);
    setSaveError(null);

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
      >
        <p>
          {cancelButtonText !==
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
              .cancelButtonText && p1}
        </p>
        {p2 && <p>{p2}</p>}
        <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            text={cancelButtonText}
            onClick={handleCancelNavigationClick} // need to pass a func to save draft
            data-dd-action-name="Cancel Navigation Continue Editing Button"
          />
          <va-button
            class="vads-u-margin-top--1 vads-u-flex--auto"
            secondary
            text={confirmButtonText}
            onClick={handleConfirmNavigationClick}
            data-dd-action-name="Confirm Navigation Leaving Button"
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
  setSaveError: PropTypes.func,
  setSavedDraft: PropTypes.func,
  shouldBlockNavigation: PropTypes.func,
  title: PropTypes.string,
  updateModalVisible: PropTypes.func,
  when: PropTypes.bool,
};

export default RouteLeavingGuard;
