import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

export const DataErrorAlert = () => {
  const body = `We’re sorry. Something went wrong on our end and we can’t load your documents available for paperless delivery. Try again later.`;
  useEffect(
    () => {
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'warning',
        'alert-box-heading': body,
        'error-key': 'api_error',
        'alert-box-full-width': false,
        'alert-box-background-only': false,
        'alert-box-closeable': false,
        'reason-for-alert': 'API error',
      });
    },
    [body],
  );
  return (
    <VaAlert role="alert" status="warning" visible>
      <p className="vads-u-margin-y--0">{body}</p>
    </VaAlert>
  );
};
