import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function FillSignInForm({ children }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      fill out and submit the sign in help form:{' '}
      <a href="https://va.gov">Help form</a>.
    </span>
  );
}
