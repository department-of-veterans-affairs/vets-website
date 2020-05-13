import { connect } from 'react-redux';

import { isLoggedIn } from 'platform/user/selectors';
import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoe,
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { setForceAuth, removeForceAuth } from 'platform/utilities/sso';

import { parseqs, checkAutoSession } from '../helpers';

function AutoSSO(props) {
  const { useSSOe, useInboundSSOe, hasCalledKeepAlive, userLoggedIn } = props;
  const auth = parseqs(window.location.search).auth;

  if (auth && auth !== 'success') {
    setForceAuth();
  }

  if (userLoggedIn) {
    removeForceAuth();
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
