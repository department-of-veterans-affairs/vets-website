import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoeInbound,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { hasSession } from 'platform/user/profile/utilities';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';

function AutoSSO(props) {
  const {
    useInboundSSOe,
    hasCalledKeepAlive,
    application = null,
    to = null,
  } = props;

  if (hasSession()) {
    removeLoginAttempted();
  }

  if (useInboundSSOe && !hasCalledKeepAlive) {
    checkAutoSession(application, to).then(() => {
      props.checkKeepAlive();
    });
  }

  return null;
}

const mapStateToProps = state => ({
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
