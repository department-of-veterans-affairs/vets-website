import { connect } from 'react-redux';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoe,
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';
import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';
import { ssoKeepAliveSession } from 'platform/utilities/sso';

export async function checkStatus(toggleKeepAlive) {
  await ssoKeepAliveSession();
  if (hasSession() && !hasSessionSSO()) {
    autoLogout();
  } else if (!hasSession() && hasSessionSSO()) {
    autoLogin();
  }

  toggleKeepAlive();
}

function AutoSSO(props) {
  const { useSSOe, useInboundSSOe, hasCalledKeepAlive } = props;

  if (
    useSSOe &&
    useInboundSSOe &&
    !hasCalledKeepAlive &&
    !environment.isLocalhost()
  ) {
    checkStatus(props.checkKeepAlive);
  }

  return null;
}

const mapStateToProps = state => ({
  useSSOe: ssoe(state),
  useInboundSSOe: ssoeInbound(state),
  hasCalledKeepAlive: hasCheckedKeepAlive(state),
});

const mapDispatchToProps = {
  checkKeepAlive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSSO);

export { AutoSSO };
