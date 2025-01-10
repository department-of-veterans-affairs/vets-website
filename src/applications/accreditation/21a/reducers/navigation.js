import { TOGGLE_LOGIN_MODAL } from 'platform/site-wide/user-nav/actions';

/**
 * The `save-in-progress` module expects our redux store to have a
 * `showLoginModal` property. ARP doesn't have a login modal, but our UX of
 * redirecting to the sign-in app is essentially equivalent UX and therefore
 * suffices as a direct substitution. So let's keep the property so that SIP
 * doesn't raise an exception due to its absence and also so that we can use its
 * state to drive appropriate behavior. We'll map to the appropriate name
 * `selectGoToSignIn` in our selectors.
 */
function navigationReducer(state = { showLoginModal: false }, action) {
  if (action.type === TOGGLE_LOGIN_MODAL) {
    return {
      ...state,
      showLoginModal: action.isOpen,
    };
  }
  return state;
}

export default navigationReducer;
