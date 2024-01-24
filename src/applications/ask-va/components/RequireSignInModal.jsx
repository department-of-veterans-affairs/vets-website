import React from 'react';
import { Link } from 'react-router';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const RequireSignInModal = ({ onClose, show, restrictedItem }) => {
  return (
    <VaModal
      clickToClose
      status="info TEST"
      modalTitle="You must Sign In to continue"
      onCloseEvent={onClose}
      visible={show}
      uswds
    >
      <p>
        To continue with {restrictedItem} selected you must Sign In or make
        another selection.
      </p>
      <Link aria-label="Go sign in" to="/contact-us/ask-va-too/introduction">
        <VaButton
          onClick={() => {}}
          primary
          text="Sign in and Start Over"
          uswds
        />
      </Link>
      <VaButton onClick={onClose} secondary text="Do Not Sign In" uswds />
    </VaModal>
  );
};

export default RequireSignInModal;
