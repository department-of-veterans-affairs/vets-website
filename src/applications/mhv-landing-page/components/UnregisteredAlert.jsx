import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const UnregisteredAlert = ({ headline, recordEvent, status }) => {
  useEffect(() => {
    recordEvent({
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': status,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VaAlert status={status} data-testid="unregistered-alert" disableAnalytics>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--0">
          To access My HealtheVet, <b>at least one</b> of these descriptions
          must be true:
        </p>
        <ul>
          <li>
            You’ve received care at a VA facility, <b>or</b>
          </li>
          <li>You’ve applied for VA health care</li>
        </ul>
        <p className="vads-u-margin-y--0">
          If you’ve received care at a VA health facility, call the facility and
          ask if you’re registered.
        </p>
        <p>
          <a href="/find-locations/?&facilityType=health">
            Find your nearest VA health facility
          </a>
        </p>
        <p className="vads-u-margin-y--0">
          If you’re not enrolled in VA health care, you can apply now.
        </p>
        <p>
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </p>
      </div>
    </VaAlert>
  );
};

UnregisteredAlert.defaultProps = {
  headline: 'You don’t have access to My HealtheVet',
  recordEvent: recordEventFn,
  status: 'warning',
};

UnregisteredAlert.propTypes = {
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  status: PropTypes.string,
};

export default UnregisteredAlert;
