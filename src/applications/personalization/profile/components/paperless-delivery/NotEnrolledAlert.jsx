import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

export const NotEnrolledAlert = () => {
  const heading = 'Paperless delivery not available yet';
  useEffect(() => {
    recordEvent({
      event: 'visible-alert-box',
      'alert-box-type': 'info',
      'alert-box-heading': heading,
      'error-key': 'not_enrolled',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'Not enrolled in VA benefits',
    });
  }, []);
  return (
    <VaAlert role="alert" status="info" visible>
      <h2 slot="headline">{heading}</h2>
      <p className="vads-u-margin-y--0">
        You’re not enrolled in any VA benefits that offer paperless delivery
        options.
      </p>
    </VaAlert>
  );
};
