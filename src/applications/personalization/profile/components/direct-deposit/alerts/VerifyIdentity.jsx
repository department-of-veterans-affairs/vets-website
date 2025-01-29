import React from 'react';
import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';

export default function VerifyIdentity() {
  return (
    <VerifyAlert headingLevel={2} dataTestId="direct-deposit-mfa-message" />
  );
}
