import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import manifest from '../manifest.json';

const RequireSignInModal = ({ onClose, show, restrictedItem, message }) => {
  const navigateToAskVAAndTriggerLoginModal = () => {
    onClose();
    window.location.href = `${
      manifest.rootUrl
    }/introduction?showSignInModal=true`;
  };

  useEffect(
    () => {
      focusElement('p.ask-va-modal-content');
    },
    [show],
  );

  const restrictedItemCopy = {
    category: {
      text: 'this category',
      buttonText: 'category',
    },
    topic: {
      text: 'this topic',
      buttonText: 'topic',
    },
    question: {
      text: 'yourself or someone else',
      buttonText: 'question',
    },
  };

  if (!show) {
    return null;
  }

  return (
    <VaModal
      clickToClose
      status="continue"
      modalTitle="You need to sign in"
      onCloseEvent={onClose}
      visible={show}
      onPrimaryButtonClick={navigateToAskVAAndTriggerLoginModal}
      onSecondaryButtonClick={onClose}
      primaryButtonText="Sign in"
      secondaryButtonText={`Go back to ${
        restrictedItemCopy[restrictedItem].buttonText
      }`}
    >
      {message ? (
        <p className="ask-va-modal-content">{message}</p>
      ) : (
        <p className="ask-va-modal-content">
          Because your question is about{' '}
          {restrictedItemCopy[restrictedItem].text}, you need to sign in. When
          you sign in, we can communicate with you <strong>securely</strong>{' '}
          about the specific details of <strong>your benefits.</strong>
        </p>
      )}
    </VaModal>
  );
};

RequireSignInModal.propTypes = {
  message: PropTypes.string,
  restrictedItem: PropTypes.string,
  router: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RequireSignInModal;
