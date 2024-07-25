import React from 'react';
import PropTypes from 'prop-types';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import UnregisteredAlert from './UnregisteredAlert';
import MhvRegistrationAlert from './MhvRegistrationAlert';

const LandingPageAlerts = ({
  userVerified,
  userRegistered,
  userHasMhvAccount,
  unVerifiedHeadline,
  signInService,
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
  </>
);

LandingPageAlerts.propTypes = {
  signInService: PropTypes.string.isRequired,
  unVerifiedHeadline: PropTypes.string.isRequired,
  userHasMhvAccount: PropTypes.bool.isRequired,
  userRegistered: PropTypes.bool.isRequired,
  userVerified: PropTypes.bool.isRequired,
};

export default LandingPageAlerts;
