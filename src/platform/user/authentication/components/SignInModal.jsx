import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default function SignInModal({ onClose, visible }) {
  const useSiS = useSelector(signInServiceEnabled);

  useEffect(
    () => {
      const isOAuthEvent = useSiS ? '-oauth' : '';
      const url = new URL(window.location);
      if (visible) {
        recordEvent({ event: `login-modal-opened${isOAuthEvent}` });

        if (!url.searchParams.has('next')) {
          url.searchParams.set('next', 'loginModal');
        }

        if (useSiS) {
          url.searchParams.set(
            'oauth',
            url.searchParams.get('oauth') || 'true',
          );
        }
      }
      window.history.pushState({}, '', url);

      return () => {
        url.searchParams.delete('oauth');
        window.history.pushState({}, '', url);
        recordEvent({ event: `login-modal-closed${isOAuthEvent}` });
      };
    },
    [visible, useSiS],
  );
  return (
    <Modal
      cssClass="va-modal-large new-modal-design"
      visible={visible}
      focusSelector="button"
      onClose={onClose}
      id="signin-signup-modal"
    >
      <LoginContainer />
    </Modal>
  );
}

SignInModal.propTypes = {
  useSiS: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
