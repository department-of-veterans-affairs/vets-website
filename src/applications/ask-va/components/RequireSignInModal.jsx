import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const RequireSignInModal = ({ onClose, show, restrictedItem, message }) => {
  const dispatch = useDispatch();

  const openLoginModal = () => {
    onClose();
    dispatch(toggleLoginModal(true));
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

  return (
    <VaModal
      clickToClose
      status="continue"
      modalTitle="You need to sign in"
      onCloseEvent={onClose}
      visible={show}
      onPrimaryButtonClick={openLoginModal}
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
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RequireSignInModal;
