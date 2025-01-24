import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from 'platform/user/authentication/components/VerifyAlert';
import NeedHelp from './NeedHelp';

export const IdentityVerificationAlert = () => {
  return (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--8 vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <VerifyAlert headingLevel={3} />
      <p className="vads-u-margin-y--4">
        <va-link
          href="/resources/verifying-your-identity-on-vagov/"
          text="Learn how to verify your identity on VA.gov"
          data-testid="verify-identity-link"
        />
      </p>
      <NeedHelp />
    </div>
  );
};

IdentityVerificationAlert.propTypes = {
  onVerify: PropTypes.func,
};

export default IdentityVerificationAlert;
