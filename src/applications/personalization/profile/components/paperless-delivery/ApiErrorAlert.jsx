import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

export const ApiErrorAlert = () => {
  const heading = 'This page isn’t available right now';
  useEffect(() => {
    recordEvent({
      event: 'visible-alert-box',
      'alert-box-type': 'warning',
      'alert-box-heading': heading,
      'error-key': 'api_error',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'API error',
    });
  }, []);
  return (
    <VaAlert role="alert" status="warning" visible>
      <h2 slot="headline">{heading}</h2>
      <p className="vads-u-margin-y--0">
        We’re sorry. Something went wrong on our end. Refresh this page or try
        again later.
      </p>
    </VaAlert>
  );
};
