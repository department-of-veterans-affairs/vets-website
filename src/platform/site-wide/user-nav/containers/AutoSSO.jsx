import { connect } from 'react-redux';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoeInbound,
  hasCheckedKeepAlive,
  isAuthenticatedWithSSOe,
} from 'platform/user/authentication/selectors';
import { isLoggedIn, isProfileLoading } from 'platform/user/selectors';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';

function AutoSSO(props) {
  const {
    useInboundSSOe,
    hasCalledKeepAlive,
    authenticatedWithSSOe,
    loggedIn,
    profileLoading,
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
    useInboundSSOe &&
    !profileLoading &&
    !hasCalledKeepAlive
  ) {
    checkAutoSession(loggedIn, authenticatedWithSSOe).then(() => {
      props.checkKeepAlive();
    });
  }

  return null;
}

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  hasCalledKeepAlive: hasCheckedKeepAlive(state),
  profileLoading: isProfileLoading(state),
  loggedIn: isLoggedIn(state),
  useInboundSSOe: ssoeInbound(state),
});

const mapDispatchToProps = {
  checkKeepAlive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSSO);

export { AutoSSO };
