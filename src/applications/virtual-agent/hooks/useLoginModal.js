import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import { useDispatch } from 'react-redux';

const { useCallback, useEffect } = require('react');

export default function useLoginModal(
  isLoggedIn,
  isAuthTopic,
  virtualAgentUseStsAuthentication,
) {
  const dispatch = useDispatch();
  const showLoginModal = useCallback(
    () => {
      const event = toggleLoginModal(true, 'va-chatbot', true);
      dispatch(event);
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!isLoggedIn && isAuthTopic && virtualAgentUseStsAuthentication) {
        showLoginModal();
      }
    },
    [showLoginModal, isLoggedIn, isAuthTopic, virtualAgentUseStsAuthentication],
  );
}
