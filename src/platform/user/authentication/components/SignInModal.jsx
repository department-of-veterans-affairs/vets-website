import React, { useEffect } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default function SignInModal({ visible, onClose, useSiS }) {
  useEffect(
    () => {
      const isOAuthEvent = useSiS ? '-oauth' : '';
      if (visible) {
        recordEvent({ event: `login-modal-opened${isOAuthEvent}` });
      }
    },
    [visible, useSiS],
  );

  return visible ? (
    <VaModal
      large
      visible={visible}
      onCloseEvent={onClose}
      id="signin-signup-modal"
    >
      <LoginContainer />
    </VaModal>
  ) : null;
}
