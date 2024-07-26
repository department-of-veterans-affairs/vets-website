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
}) => (
  <>
    {!userVerified && (
      <IdentityNotVerified
        headline={unVerifiedHeadline}
        showHelpContent={false}
        showVerifyIdenityHelpInfo
        signInService={signInService}
      />
    )}
    {userVerified && !userRegistered && <UnregisteredAlert />}
    {userRegistered && !userHasMhvAccount && <MhvRegistrationAlert />}
    {userHasMhvBasicAccount && <MhvBasicAccountAlert />}
    {showsVerifyAndRegisterAlert && (
      <VerifyAndRegisterAlert cspId={signInService} />
    )}
  </>
);

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
