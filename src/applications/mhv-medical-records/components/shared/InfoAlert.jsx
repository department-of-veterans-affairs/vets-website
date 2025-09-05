import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

const InfoAlert = ({ highLowResults, recordEvent = recordEventFn }) => {
  const headline = 'Need help understanding your results';
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'info',
      });
      datadogRum.addAction('Showed Alert Box: Understanding Results');
    },
    [headline, recordEvent],
  );
  return (
    <>
      <va-alert-expandable
        data-dd-action-name="Need help understanding your results"
        trigger="Need help understanding your results?"
        data-testid="understanding-result"
        class="no-print vads-u-margin-y--1p5"
        status="info"
      >
        {highLowResults && (
          <p
            data-testid="result-dropdown-1"
            className="vads-u-padding-bottom--2"
          >
            If your results are outside the reference range (the expected range
            for that test), your results may include a word like "high" or
            "low." But this doesn’t automatically mean you have a health
            problem.
          </p>
        )}
        <p data-testid="result-dropdown-2" className="vads-u-padding-bottom--2">
          Your provider will review your results. If you need to do anything,
          your provider will contact you.
        </p>
        <p data-testid="result-dropdown-3" className="vads-u-padding-bottom--2">
          If you have any questions, send a message to the care team that
          ordered this test.
        </p>
        <p data-testid="new-message-link" className="vads-u-padding-bottom--2">
          <va-link
            href="/my-health/secure-messages/new-message/"
            text="Start a new message"
            onClick={() => {
              datadogRum.addAction('Start a new message - L&TR Details info');
            }}
          />
        </p>
        <p data-testid="result-Alert-note">
          <strong>Note:</strong> If you have questions about more than 1 test
          ordered by the same care team, send 1 message with all of your
          questions.
        </p>
      </va-alert-expandable>
    </>
  );
};

export default InfoAlert;

InfoAlert.propTypes = {
  highLowResults: PropTypes.any,
  recordEvent: PropTypes.func,
};
