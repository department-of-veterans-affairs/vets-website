import React from 'react';
import VerifyAlert from '~/platform/user/authentication/components/VerifyAlert';

export default function VerifyIdentity({ dataTestId }) {
  return (
    <div data-testid={dataTestId}>
      <VerifyAlert headingLevel={2} />
    </div>
  );
}
