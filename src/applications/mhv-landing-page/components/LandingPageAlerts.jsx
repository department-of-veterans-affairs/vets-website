import React from 'react';
import PropTypes from 'prop-types';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import CardLayout from './CardLayout';
import MhvRegistrationAlert from './MhvRegistrationAlert';
import UnregisteredAlert from './UnregisteredAlert';
import MhvBasicAccountAlert from './MhvBasicAccountAlert';
import VerifyAndRegisterAlert from './VerifyAndRegisterAlert';

const LandingPageAlerts = ({
  registered,
  verified,
  userHasMhvAccount,
  userHasMhvBasicAccount,
  showsVerifyAndRegisterAlert,
  signInService,
  cards,
  unVerifiedHeadline,
}) => {
  const noCardsDisplay = verified ? (
    <UnregisteredAlert />
  ) : (
    <IdentityNotVerified
      headline={unVerifiedHeadline}
      showHelpContent={false}
      showVerifyIdenityHelpInfo
      signInService={signInService}
    />
  );

  return (
    <>
      {registered && !userHasMhvAccount && <MhvRegistrationAlert />}
      {registered ? <CardLayout data={cards} /> : noCardsDisplay}
      {userHasMhvBasicAccount && <MhvBasicAccountAlert />}
      {showsVerifyAndRegisterAlert && (
        <VerifyAndRegisterAlert cspId={signInService} />
      )}
    </>
  );
};

LandingPageAlerts.propTypes = {
  cards: PropTypes.array.isRequired,
  registered: PropTypes.bool.isRequired,
  showsVerifyAndRegisterAlert: PropTypes.bool.isRequired,
  signInService: PropTypes.string.isRequired,
  unVerifiedHeadline: PropTypes.string.isRequired,
  userHasMhvAccount: PropTypes.bool.isRequired,
  userHasMhvBasicAccount: PropTypes.bool.isRequired,
  verified: PropTypes.bool.isRequired,
};

export default LandingPageAlerts;
