import React, { useEffect } from 'react';
import { Link } from 'react-router';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';

const RequireSignInModal = ({ onClose, show, restrictedItem, message }) => {
  useEffect(
    () => {
      focusElement('p.ask-va-modal-content');
    },
    [show],
  );

  return (
    <VaModal
      clickToClose
      status="continue"
      modalTitle="You must Sign In to continue"
      onCloseEvent={onClose}
      visible={show}
    >
      {message ? (
        <p className="ask-va-modal-content">{message}</p>
      ) : (
        <p className="ask-va-modal-content">
          Because your question is about this {restrictedItem}, you need to sign
          in. When you sign in, we can communicate with you{' '}
          <strong>securely</strong> about the specific details of{' '}
          <strong>your benefits.</strong>
        </p>
      )}
      <Link
        className="margin-top-1"
        aria-label="Go sign in"
        to="/contact-us/ask-va-too/introduction"
      >
        <VaButton onClick={() => {}} primary text="Sign in" />
      </Link>
      <VaButton
        className="margin-top-1"
        onClick={onClose}
        secondary
        text={`Go back to ${message ? 'question' : restrictedItem}`}
      />
    </VaModal>
  );
};

export default RequireSignInModal;
