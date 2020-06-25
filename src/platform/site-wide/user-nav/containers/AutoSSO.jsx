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
  const {
    useSSOe,
    useInboundSSOe,
    hasCalledKeepAlive,
    userLoggedIn,
    application = null,
    to = null,
  } = props;
  const params = new URLSearchParams(window.location.search);

  if (userLoggedIn) {
    removeForceAuth();
  } else if (useInboundSSOe === false) {
    // if inbound ssoe is disabled, always force the user to re enter their
    // credentials when they attempt to authenticate
    setForceAuth();
  }

  if (useSSOe && useInboundSSOe && !hasCalledKeepAlive) {
    checkAutoSession(application, to).then(() => {
      props.checkKeepAlive();
    });
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
