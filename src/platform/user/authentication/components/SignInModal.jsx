import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import { signInServiceEnabled } from '../selectors';
import LoginContainer from './LoginContainer';

export default function SignInModal() {
  const useSiS = useSelector(signInServiceEnabled);
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(toggleLoginModal(false));
  };
  const visible = useSelector(state => state?.navigation?.showLoginModal);
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
      label="sign-in"
    >
      <LoginContainer />
    </VaModal>
  ) : null;
}
