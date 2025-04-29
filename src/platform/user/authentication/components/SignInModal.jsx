import React, { useEffect, useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default function SignInModal({ visible, onClose, useSiS }) {
  const [prevVisible, setPrevVisible] = useState(null);

  useEffect(
    () => {
      const isOAuthEvent = useSiS ? '-oauth' : '';
      if (!prevVisible && visible) {
        recordEvent({ event: `login-modal-opened${isOAuthEvent}` });
      } else if (prevVisible && !visible) {
        recordEvent({ event: `login-modal-closed${isOAuthEvent}` });
      }
      setPrevVisible(visible);
    },
    [visible, useSiS, prevVisible],
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
