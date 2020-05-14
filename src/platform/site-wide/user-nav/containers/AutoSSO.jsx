import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import { isLoggedIn } from 'platform/user/selectors';
import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoe,
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { checkAutoSession } from 'platform/utilities/sso';
import {
  setForceAuth,
  removeForceAuth,
} from 'platform/utilities/sso/forceAuth';

function AutoSSO(props) {
  const { useSSOe, useInboundSSOe, hasCalledKeepAlive, userLoggedIn } = props;
  const params = new URLSearchParams(window.location.search);

  if (userLoggedIn) {
    removeForceAuth();
  } else if (params.get('auth') !== 'success') {
    setForceAuth();
  }

  if (useSSOe && useInboundSSOe && !hasCalledKeepAlive) {
    checkAutoSession(props.checkKeepAlive);
  }

  return null;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSSO);

export { AutoSSO };
