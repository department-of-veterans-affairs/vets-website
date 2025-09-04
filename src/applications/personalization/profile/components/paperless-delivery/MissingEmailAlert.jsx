import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';

export const MissingEmailAlert = ({ emailAddress }) => {
  const heading = 'Add your email to get notified when documents are ready';
  useEffect(
    () => {
      if (!emailAddress) {
        recordEvent({
          event: 'visible-alert-box',
          'alert-box-type': 'info',
          'alert-box-heading': heading,
          'error-key': 'missing_email',
          'alert-box-full-width': false,
          'alert-box-background-only': false,
          'alert-box-closeable': false,
          'reason-for-alert': 'Missing email',
        });
      }
    },
    [emailAddress],
  );
  if (!emailAddress) {
    return (
      <VaAlert role="alert" status="info" visible>
        <h2 slot="headline">{heading}</h2>
        <p className="vads-u-margin-y--0">
          You don’t have an email address in your VA profile. If you add one,
          we’ll email you when your documents are ready.
        </p>
      </VaAlert>
    );
  }
  return null;
};

MissingEmailAlert.propTypes = {
  emailAddress: PropTypes.string,
};
