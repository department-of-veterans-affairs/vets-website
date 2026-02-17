import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openCrisisModal } from '@department-of-veterans-affairs/mhv/exports';

const CrisisLineConnectButton = props => {
  const { inAlert } = props;
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [crisisModalOpened, setCrisisModalOpened] = useState(false);

  useEffect(() => {
    const onCrisisModalClose = () => {
      setCrisisModalOpened(false);
      focusElement(lastFocusableElement);
    };

    const onEscapeKeyPress = e => {
      if (e.keyCode === 27) {
        onCrisisModalClose();
      }
    };
    const modalCloseButton =
      document.getElementsByClassName('va-modal-close')[0];

    if (crisisModalOpened && modalCloseButton) {
      modalCloseButton.addEventListener('click', onCrisisModalClose);
      window.addEventListener('keydown', onEscapeKeyPress);
    }
    return () => {
      // NODE 22 FIX: Add null check before calling removeEventListener.
      // When crisisModalOpened is false, the modal isn't in the DOM yet,
      // so modalCloseButton will be undefined. The cleanup function captures
      // this undefined value in its closure, causing a TypeError when React
      // runs the cleanup before the next effect. This is a real bug that
      // can occur in production browsers too, not just a test environment issue.
      if (modalCloseButton) {
        modalCloseButton.removeEventListener('click', onCrisisModalClose);
      }
      window.removeEventListener('keydown', onEscapeKeyPress);
    };
  }, [lastFocusableElement, crisisModalOpened]);

  return (
    <va-button
      class="vads-u-margin-y--1p5"
      secondary="true"
      text="Connect with the Veterans Crisis Line"
      data-dd-action-name={`Connect with the VCL Button${
        inAlert ? ' - in alert' : ''
      }`}
      onClick={e => {
        setLastFocusableElement(e.target.shadowRoot.firstChild);
        setCrisisModalOpened(true);
        openCrisisModal();
      }}
    />
  );
};

CrisisLineConnectButton.propTypes = {
  inAlert: PropTypes.bool,
};

export default CrisisLineConnectButton;
