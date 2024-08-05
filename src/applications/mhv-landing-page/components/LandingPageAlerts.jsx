import React from 'react';
import PropTypes from 'prop-types';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import UnregisteredAlert from './UnregisteredAlert';
import MhvRegistrationAlert from './MhvRegistrationAlert';
import MhvBasicAccountAlert from './MhvBasicAccountAlert';
import VerifyAndRegisterAlert from './VerifyAndRegisterAlert';

const LandingPageAlerts = ({
  signInService,
  showsVerifyAndRegisterAlert,
  unVerifiedHeadline,
  userHasMhvAccount,
  userHasMhvBasicAccount,
  userRegistered,
  userVerified,
}) => {
  const alerts = [];

  if (userHasMhvBasicAccount && !userVerified) {
    alerts.push(<MhvBasicAccountAlert key="basic-account" />);
  }

  if (
    (signInService === 'idme' || signInService === 'logingov') &&
    !userVerified &&
    showsVerifyAndRegisterAlert
  ) {
    alerts.push(
      <VerifyAndRegisterAlert key="verify-register" cspId={signInService} />,
    );
  }

  if (!userVerified) {
    alerts.push(
      <IdentityNotVerified
        key="identity-not-verified"
        headline={unVerifiedHeadline}
        showHelpContent={false}
        showVerifyIdenityHelpInfo
        signInService={signInService}
      />,
    );
  }

  if (!userRegistered) {
    alerts.push(<UnregisteredAlert key="unregistered" />);
  }

  if (userRegistered && !userHasMhvAccount) {
    alerts.push(<MhvRegistrationAlert key="mhv-registration" />);
  }

  return <>{alerts}</>;
};

LandingPageAlerts.propTypes = {
  showsVerifyAndRegisterAlert: PropTypes.bool.isRequired,
  signInService: PropTypes.string.isRequired,
  unVerifiedHeadline: PropTypes.string.isRequired,
  userHasMhvAccount: PropTypes.bool.isRequired,
  userHasMhvBasicAccount: PropTypes.bool.isRequired,
  userRegistered: PropTypes.bool.isRequired,
  userVerified: PropTypes.bool.isRequired,
};

export default LandingPageAlerts;
