import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openCrisisModal } from '@department-of-veterans-affairs/mhv/exports';

const CrisisLineConnectButton = props => {
  const { inAlert } = props;
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [crisisModalOpened, setCrisisModalOpened] = useState(false);

  useEffect(
    () => {
      const onCrisisModalClose = () => {
        setCrisisModalOpened(false);
        focusElement(lastFocusableElement);
      };

      const onEscapeKeyPress = e => {
        if (e.keyCode === 27) {
          onCrisisModalClose();
        }
      };
      const modalCloseButton = document.getElementsByClassName(
        'va-modal-close',
      )[0];

      if (crisisModalOpened) {
        modalCloseButton.addEventListener('click', onCrisisModalClose);
        window.addEventListener('keydown', onEscapeKeyPress);
      }
      return () => {
        modalCloseButton.removeEventListener('click', onCrisisModalClose);
        window.removeEventListener('keydown', onEscapeKeyPress);
      };
    },
    [lastFocusableElement, crisisModalOpened],
  );

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
