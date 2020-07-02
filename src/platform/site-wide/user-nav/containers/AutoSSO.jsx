import { connect } from 'react-redux';

import { checkKeepAlive } from 'platform/user/authentication/actions';
import {
  ssoeInbound,
  isAuthenticatedWithSSOe,
  hasCheckedKeepAlive,
} from 'platform/user/authentication/selectors';
import { hasSession } from 'platform/user/profile/utilities';
import { checkAutoSession } from 'platform/utilities/sso';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';

function AutoSSO(props) {
  const {
    useInboundSSOe,
    authenticatedWithSSOe,
    hasCalledKeepAlive,
    application = null,
    to = null,
  } = props;

  if (hasSession()) {
    removeLoginAttempted();
  }

  if (useInboundSSOe && !hasCalledKeepAlive) {
    checkAutoSession(authenticatedWithSSOe, application, to).then(() => {
      props.checkKeepAlive();
    });
  }

  return null;
}

const mapStateToProps = state => ({
  useInboundSSOe: ssoeInbound(state),
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
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
