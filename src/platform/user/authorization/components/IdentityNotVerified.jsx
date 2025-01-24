import React from 'react';
import VerifyAlert from 'platform/user/authentication/components/VerifyAlert';

export const HowToVerifyLink = () => (
  <p className="vads-u-margin-y--4">
    <va-link
      href="/resources/verifying-your-identity-on-vagov/"
      text="Learn how to verify your identity on VA.gov"
      data-testid="verify-identity-link"
    />
  </p>
);

const IdentityNotVerified = ({ dataTestId }) => {
  return (
    <div className="vads-u-margin-y--2" data-testid={dataTestId}>
      <VerifyAlert headingLevel={2} />
    </div>
  );
};

export { IdentityNotVerified as default };
