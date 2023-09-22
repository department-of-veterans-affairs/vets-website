import React, { useEffect, useState } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { openCrisisModal } from '../util/helpers';

const CrisisLineConnectButton = () => {
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [crisisModalOpened, setCrisisModalOpened] = useState(false);

  useEffect(
    () => {
      const onCrisisModalClose = () => {
        setCrisisModalOpened(false);
        focusElement(lastFocusableElement);
      };
      const modalCloseButton = document.getElementsByClassName(
        'va-modal-close',
      )[0];
      if (crisisModalOpened) {
        modalCloseButton.addEventListener('click', onCrisisModalClose);
      }
      return () => {
        modalCloseButton.removeEventListener('click', onCrisisModalClose);
      };
    },
    [lastFocusableElement, crisisModalOpened],
  );

  return (
    <va-button
      secondary="true"
      text="Connect with the Veterans Crisis Line"
      onClick={e => {
        setLastFocusableElement(e.target.shadowRoot.firstChild);
        setCrisisModalOpened(true);
        openCrisisModal();
      }}
    />
  );
};

export default CrisisLineConnectButton;
