import React from 'react';
import { connect } from 'react-redux';

import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';
import { ssoe, ssoeInbound } from 'platform/user/authentication/selectors';
import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';
import { ssoKeepAliveSession } from 'platform/utilities/sso';

class AutoSSO extends React.Component {
  state = {
    hasCalledKeepAlive: false,
  };

  componentDidUpdate() {
    const { useSSOe, useInboundSSOe } = this.props;
    const { hasCalledKeepAlive } = this.state;

    if (useSSOe && useInboundSSOe && !hasCalledKeepAlive) {
      this.checkStatus();
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  clearInterval = () => {
    clearInterval(this.statusInterval);
    this.statusInterval = null;
  };

  checkStatus = () => {
    ssoKeepAliveSession().then(() => {
      if (hasSession() && hasSessionSSO() === 'false') {
        autoLogout();
      } else if (!hasSession() && hasSessionSSO() === 'true') {
        autoLogin();
      }

      this.setState({ hasCalledKeepAlive: true });
    });
  };

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  useSSOe: ssoe(state),
  useInboundSSOe: ssoeInbound(state),
});

export default connect(mapStateToProps)(AutoSSO);

export { AutoSSO };
