import React from 'react';
import { connect } from 'react-redux';

import { autoLogin, autoLogout } from 'platform/user/authentication/utilities';
import { ssoe, ssoeInbound } from 'platform/user/authentication/selectors';
import { hasSession, hasSessionSSO } from 'platform/user/profile/utilities';
import { ssoKeepAliveSession } from 'platform/utilities/sso';

const AUTO_SSO_FREQUENCY = 60;

class AutoSSO extends React.Component {
  constructor(props) {
    super(props);
    this.statusInterval = null;
  }

  componentDidUpdate() {
    const { useSSOe, useInboundSSOe } = this.props;

    if (useSSOe && useInboundSSOe) {
      this.statusInterval = setInterval(this.checkStatus, AUTO_SSO_FREQUENCY);
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
    });
  };

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  useSSOe: ssoe(state),
  useInbountSSOe: ssoeInbound(state),
});

export default connect(mapStateToProps)(AutoSSO);

export { AutoSSO };
