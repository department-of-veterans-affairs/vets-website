import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fromPairs } from 'lodash';

import { isLoggedIn } from 'platform/user/selectors';
import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoe,
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';
import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';
import {
  ssoKeepAliveSession,
  getForceAuth,
  setForceAuth,
  deleteForceAuth,
} from 'platform/utilities/sso';

function parseqs(value) {
  /*
   * naive query string parsing function, takes a query string and returns
   * an object mapping the keys to values.
   */
  const data = value.startsWith('?') ? value.substring(1) : value;
  const entries = data ? data.split('&').map(q => q.split('=')) : [];
  return fromPairs(entries);
}

export async function checkStatus(toggleKeepAlive) {
  await ssoKeepAliveSession();
  if (hasSession() && !hasSessionSSO()) {
    autoLogout();
  } else if (!hasSession() && hasSessionSSO() && !getForceAuth()) {
    autoLogin();
  }

  toggleKeepAlive();
}

class AutoSSO extends React.Component {
  render() {
    const {
      useSSOe,
      useInboundSSOe,
      hasCalledKeepAlive,
      userLoggedIn,
    } = this.props;

    if (parseqs(window.location.search).auth === 'force-needed') {
      setForceAuth();
    }

    if (userLoggedIn) {
      deleteForceAuth();
    }

    if (useSSOe && useInboundSSOe && !hasCalledKeepAlive) {
      checkStatus(this.props.checkKeepAlive);
    }

    return null;
  }
}

const mapStateToProps = state => ({
  useSSOe: ssoe(state),
  useInboundSSOe: ssoeInbound(state),
  hasCalledKeepAlive: hasCheckedKeepAlive(state),
  userLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  checkKeepAlive,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AutoSSO),
);

export { AutoSSO };
