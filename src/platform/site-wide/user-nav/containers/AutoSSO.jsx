import { connect } from 'react-redux';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  hasCheckedKeepAlive,
  isAuthenticatedWithOAuth,
  ssoeTransactionId,
} from 'platform/user/authentication/selectors';
import {
  selectProfile,
  isLoggedIn,
  isProfileLoading,
} from 'platform/user/selectors';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

function AutoSSO(props) {
  const {
    authenticatedWithOAuth,
    hasCalledKeepAlive,
    transactionId,
    loggedIn,
    profileLoading,
    profile,
    ial2Enforcement,
  } = props;

  if (loggedIn) {
    removeLoginAttempted();
  }

  const badPaths = ['auth/login/callback', 'logout'];
  const isValidPath = !badPaths.some(path =>
    window.location.pathname.includes(path),
  );

  if (
    // avoid race condition where hasSession hasn't been set
    isValidPath &&
    !profileLoading &&
    !hasCalledKeepAlive &&
    !authenticatedWithOAuth
  ) {
    checkAutoSession(loggedIn, transactionId, profile, ial2Enforcement).then(
      () => {
        props.checkKeepAlive();
      },
    );
  }

  return null;
}

const mapStateToProps = state => ({
  authenticatedWithOAuth: isAuthenticatedWithOAuth(state),
  profile: selectProfile(state),
  transactionId: ssoeTransactionId(state),
  hasCalledKeepAlive: hasCheckedKeepAlive(state),
  profileLoading: isProfileLoading(state),
  loggedIn: isLoggedIn(state),
  ial2Enforcement:
    state.featureToggles?.[TOGGLE_NAMES.identityIal2FullEnforcement] || false,
});

const mapDispatchToProps = {
  checkKeepAlive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSSO);

export { AutoSSO };
