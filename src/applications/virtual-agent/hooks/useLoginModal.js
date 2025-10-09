import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { setLoggedInFlow } from '../utils/sessionStorage';

/**
 * useLoginModalOnEvent
 * Listens for a DOM CustomEvent (default: 'va-login-attempt') and opens the login modal
 * every time the event is dispatched:  window.dispatchEvent(new CustomEvent('va-login-attempt'))
 *
 * @returns {Function} showLoginModal - Imperative function to manually open the modal if needed.
 */
export default function useLoginModalOnEvent() {
  const dispatch = useDispatch();

  const showLoginModal = useCallback(
    () => {
      // mark that the login modal was triggered by the chatbot so post-login
      // logic can auto-accept the disclaimer
      setLoggedInFlow('true');
      dispatch(toggleLoginModal(true, 'va-chatbot', true));
    },
    [dispatch],
  );

  useEffect(
    () => {
      // Handler that will open the modal each time the event fires
      const handler = () => {
        showLoginModal();
      };

      window.addEventListener('webchat-auth-activity', handler);
      return () => {
        window.removeEventListener('webchat-auth-activity', handler);
      };
    },
    [showLoginModal],
  );

  return showLoginModal;
}
