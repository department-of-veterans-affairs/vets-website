import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

const AlertMhvRegistration = ({ headline, recordEvent, ssoe, testId }) => {
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
    },
    [headline, recordEvent],
  );

  const mhvLink = `${mhvUrl(ssoe, '')}home&postLogin=true`;

  return (
    <div
      className="mhv-c-reg-alert mhv-u-reg-alert-warning usa-alert vads-u-display--flex
    vads-u-align-items--flex-start vads-u-justify-content--center vads-u-flex-direction--row
    vads-u-margin-bottom--3"
      data-testid={testId}
    >
      <va-icon icon="lock" size={4} />
      <div className="mhv-u-reg-alert-col vads-u-flex-direction--col">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {headline}
        </h2>
        <div className="mhv-u-reg-alert-body" role="presentation">
          <p className="vads-u-margin-y--0">
            Before you can access your messages, medications, and medical
            records, we need to confirm your personal information and
            relationship with VA health care. After you register, come back to
            this page.
          </p>
          <p>
            <a className="vads-c-action-link--green" href={mhvLink}>
              Register with My HealtheVet
            </a>
          </p>
          <p>
            <a href="/resources/how-to-access-my-healthevet-on-vagov/">
              Learn how to access My HealtheVet on VA.gov
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

AlertMhvRegistration.defaultProps = {
  headline: 'Register your account with My HealtheVet',
  recordEvent: recordEventFn,
  ssoe: false,
  testId: 'mhv-alert--mhv-registration',
};

AlertMhvRegistration.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  ssoe: PropTypes.bool,
  testId: PropTypes.string,
};

export default AlertMhvRegistration;
