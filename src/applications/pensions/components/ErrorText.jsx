import React from 'react';
import CallVBACenter from 'platform/static-data/CallVBACenter';

/**
 * Creates error text with call center number
 * @returns {React.Element} - Error text with call center number
 */
export default function ErrorText() {
  return (
    <p>
      If it still doesn’t work, please <CallVBACenter />
    </p>
  );
}
