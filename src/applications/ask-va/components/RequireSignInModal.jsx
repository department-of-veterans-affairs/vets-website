import React, { useEffect } from 'react';
import { Link } from 'react-router';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';

const RequireSignInModal = ({ onClose, show, restrictedItem }) => {
  useEffect(
    () => {
      focusElement('p.ask-va-modal-content');
    },
    [show],
  );

  return (
    <VaModal
      clickToClose
      status="info TEST"
      modalTitle="You must Sign In to continue"
      onCloseEvent={onClose}
      visible={show}
    >
      <p className="ask-va-modal-content">
        To continue with {restrictedItem} selected you must Sign In or make
        another selection.
      </p>
      <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
        <VaButton onClick={() => {}} primary text="Sign in and Start Over" />
      </Link>
      <VaButton onClick={onClose} secondary text="Do Not Sign In" />
    </VaModal>
  );
};

export default RequireSignInModal;
