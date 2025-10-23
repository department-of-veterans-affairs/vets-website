import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

const AlertDownloadSuccess = ({
  className,
  focusId,
  headline,
  recordEvent,
  testId,
}) => {
  useEffect(
    () => {
      if (focusId) {
        focusElement(`#${focusId}`);
      }
    },
    [focusId],
  );

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'success',
      });
      datadogRum.addAction('Showed Alert Box: Pdf download started');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert
      id={focusId}
      status="success"
      className={`vads-u-margin-top--4 no-print ${className}`}
      role="alert"
      data-testid={testId}
    >
      <h2 slot="headline" data-testid="download-success-alert-message">
        {headline}
      </h2>
      <p className="vads-u-margin--0">
        Your file should download automatically. If it doesn’t, try again. If
        you can’t find it, check your browser settings to find where your
        browser saves downloaded files.
      </p>
    </VaAlert>
  );
};

AlertDownloadSuccess.defaultProps = {
  headline: 'Download started',
  recordEvent: recordEventFn,
  testId: 'mhv-alert--download-started',
};

AlertDownloadSuccess.propTypes = {
  className: PropTypes.string,
  focusId: PropTypes.string,
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertDownloadSuccess;
