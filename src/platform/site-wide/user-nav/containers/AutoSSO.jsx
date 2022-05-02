import { connect } from 'react-redux';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  hasCheckedKeepAlive,
  ssoeTransactionId,
} from 'platform/user/authentication/selectors';
import {
  selectProfile,
  isLoggedIn,
  isProfileLoading,
} from 'platform/user/selectors';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';

function AutoSSO(props) {
  const {
    hasCalledKeepAlive,
    transactionId,
    loggedIn,
    profileLoading,
    profile,
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
    !hasCalledKeepAlive
  ) {
    checkAutoSession(loggedIn, transactionId, profile).then(() => {
      props.checkKeepAlive();
    });
  }

  return null;
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  transactionId: ssoeTransactionId(state),
  hasCalledKeepAlive: hasCheckedKeepAlive(state),
  profileLoading: isProfileLoading(state),
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  checkKeepAlive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSSO);

export { AutoSSO };
