import React from 'react';
import PropTypes from 'prop-types';
import recordEventFn from '~/platform/monitoring/record-event';

const AlertMhvUserAction = ({ errorCode, testId }) => {
  return (
    <div
      className="mhv-c-reg-alert mhv-u-reg-alert-error usa-alert usa-alert-error vads-u-display--flex
        vads-u-align-items--flex-start vads-u-justify-content--center vads-u-flex-direction--row
        vads-u-margin-bottom--3"
      data-testid={testId}
    >
      <div className="mhv-u-reg-alert-col vads-u-flex-direction--col">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          Contact the My HealtheVet help desk: Error code {errorCode}
        </h2>
        <div className="mhv-u-reg-alert-body" role="presentation">
          <p className="vads-u-margin-y--0">
            We’re having trouble giving you access to your messages,
            medications, and medical records.
          </p>

          <p>
            To get access to these My HealtheVet tools, call us at 877-327-0022
            (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8 p.m.
            ET. Tell the representative that you received{' '}
            <b>error code {errorCode}</b>
          </p>

          <p>
            If you need to contact your care team now, call your VA health
            facility.
          </p>

          <a href="/find-locations/?page=1&facilityType=health">
            Find your VA health facility
          </a>
        </div>
      </div>
    </div>
  );
};

AlertMhvUserAction.defaultProps = {
  errorCode: 'unknown',
  recordEvent: recordEventFn,
  ssoe: false,
  testId: 'mhv-alert--mhv-registration',
};

AlertMhvUserAction.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  ssoe: PropTypes.bool,
  testId: PropTypes.string,
};

export default AlertMhvUserAction;
