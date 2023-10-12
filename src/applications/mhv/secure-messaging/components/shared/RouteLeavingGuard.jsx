import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ErrorMessages } from '../../util/constants';

export const RouteLeavingGuard = ({
  navigate,
  when,
  modalVisible,
  updateModalVisible,
  shouldBlockNavigation,
  title,
  p1,
  p2,
  confirmButtonText,
  cancelButtonText,
  saveDraftHandler,
}) => {
  const [lastLocation, updateLastLocation] = useState();
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false);

  const showModal = location => {
    updateModalVisible(true);
    updateLastLocation(location);
  };

  const closeModal = cb => {
    updateModalVisible(false);
    if (typeof cb === 'function') {
      cb();
    }
  };

  const handleBlockedNavigation = nextLocation => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      showModal(nextLocation);
      return false;
    }
    return true;
  };
  const handleConfirmNavigationClick = () => {
    if (
      cancelButtonText ===
      ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.saveDraft
    ) {
      saveDraftHandler('manual');
    }
    closeModal(() => {
      if (lastLocation) {
        updateConfirmedNavigation(true);
      }
    });
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
        onPrimaryButtonClick={closeModal}
        onSecondaryButtonClick={handleConfirmNavigationClick}
        onCloseEvent={closeModal}
        primaryButtonText={confirmButtonText}
        secondaryButtonText={cancelButtonText}
        status="warning"
        visible={modalVisible}
      >
        <p>
          {cancelButtonText !==
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
              .saveDraft && p1}
        </p>
        {p2 && <p>{p2}</p>}
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
  shouldBlockNavigation: PropTypes.func,
  title: PropTypes.string,
  updateModalVisible: PropTypes.func,
  when: PropTypes.bool,
};

export default RouteLeavingGuard;
