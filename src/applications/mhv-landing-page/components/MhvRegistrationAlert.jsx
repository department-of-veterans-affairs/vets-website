import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MhvRegistrationAlert = ({ headline, recordEvent, status, icon }) => {
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': status,
      });
    },
    [headline, recordEvent, status],
  );

  return (
    <>
      <div className="mhv-c-reg-alert mhv-u-reg-alert-warning usa-alert vads-u-display--flex vads-u-align-items--flex-start vads-u-justify-content--center vads-u-flex-direction--row">
        <va-icon icon={icon} size={4} />
        <div className="mhv-u-reg-alert-col vads-u-flex-direction--col">
          <h2>{headline}</h2>
          <div className="mhv-u-reg-alert-body" role="presentation">
            <p className="vads-u-margin-y--0">
              Before you can access your messages, medications, and medical
              records, we need to confirm your personal information and
              relationship with VA health care. After you register, come back to
              this page.
            </p>
            <p>
              <a
                className="vads-c-action-link--green"
                href="https://www.myhealth.va.gov/registration"
              >
                Register with My HealtheVet
              </a>
            </p>
            <p>
              <a href="https://www.va.gov/resources/how-to-access-my-healthevet-on-vagov/">
                Learn how to access My HealtheVet on VA.gov
              </a>
            </p>
          </div>
        </div>
      </div>
      <VaAlert
        className="mhv-uuu"
        status="continue"
        data-testid="mhv-registration-alert"
        disableAnalytics
      >
        <h2 slot="headline">{headline}</h2>
        <div>
          <p className="vads-u-margin-y--0">
            Before you can access your messages, medications, and medical
            records, we need to confirm your personal information and
            relationship with VA health care. After you register, come back to
            this page.
          </p>
          <p>
            <a
              className="vads-c-action-link--green"
              href="https://www.myhealth.va.gov/registration"
            >
              Register with My HealtheVet
            </a>
          </p>
          <p>
            <a href="https://www.va.gov/resources/how-to-access-my-healthevet-on-vagov/">
              Learn how to access My HealtheVet on VA.gov
            </a>
          </p>
        </div>
      </VaAlert>
    </>
  );
};

MhvRegistrationAlert.defaultProps = {
  headline: 'Register your account with My HealtheVet',
  icon: 'lock',
  recordEvent: recordEventFn,
  status: 'warning',
};

MhvRegistrationAlert.propTypes = {
  headline: PropTypes.string,
  icon: PropTypes.string,
  recordEvent: PropTypes.func,
  status: PropTypes.string,
};

export default MhvRegistrationAlert;
