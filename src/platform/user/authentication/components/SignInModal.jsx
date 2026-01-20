import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import LoginContainer from './LoginContainer';

export default function SignInModal() {
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(toggleLoginModal(false));
  };
  const visible = useSelector(state => state?.navigation?.showLoginModal);
  const [prevVisible, setPrevVisible] = useState(null);

  useEffect(
    () => {
      if (!prevVisible && visible) {
        recordEvent({ event: 'login-modal-opened-oauth' });
      } else if (prevVisible && !visible) {
        recordEvent({ event: 'login-modal-closed-oauth' });
      }
      setPrevVisible(visible);
    },
    [visible, prevVisible],
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
