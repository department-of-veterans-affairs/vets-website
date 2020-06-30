import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import { isLoggedIn } from 'platform/user/selectors';
import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';

function AutoSSO(props) {
  const { useInboundSSOe, hasCalledKeepAlive, userLoggedIn } = props;

  if (userLoggedIn) {
    removeLoginAttempted();
  }

  if (useInboundSSOe && !hasCalledKeepAlive) {
    checkAutoSession().then(() => {
      props.checkKeepAlive();
    });
  }

  return null;
}

const mapStateToProps = state => ({
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
