import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';

const AlertAccountApiAlert = ({
  errorCode,
  testId,
  recordEvent,
  userActionable = false,
}) => {
  const headline = userActionable
    ? `Error code ${errorCode}: Contact the My HealtheVet help desk`
    : `You can't access messages, medications, or medical records right now`;
  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
      datadogRum.addAction('Showed Alert Box: Alert Account API ');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert
      className="vads-u-margin-bottom--3"
      data-testid={testId}
      status="error"
      visible
    >
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        {headline}
      </h2>
      {userActionable ? (
        <div className="mhv-u-reg-alert-body" role="presentation">
          <p className="vads-u-margin-y--0">
            We’re having trouble giving you access to your messages,
            medications, and medical records.
          </p>

          <p>
            To get access to these My HealtheVet tools, call us at&nbsp;
            <va-telephone contact="8773270022" />(<va-telephone contact="711" />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. Tell
            the representative that you received&nbsp;
            <b>error code {errorCode}</b>.
          </p>

          <p>
            If you need to contact your care team now, call your VA health
            facility.
          </p>

          <a href="/find-locations/?page=1&facilityType=health">
            Find your VA health facility
          </a>
        </div>
      ) : (
        <div className="mhv-u-reg-alert-body" role="presentation">
          <p className="vads-u-margin-y--0">
            We’re sorry. There’s a problem with our system. Try refreshing this
            page. Or check back later.
          </p>

          {errorCode > 0 ? (
            <p>
              If the problem persists, call the My HealtheVet helpdesk at
              877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00
              a.m. to 8 p.m. ET. Tell the representative that you received{' '}
              <b>error code {errorCode}</b>.
            </p>
          ) : (
            <p>
              If the problem persists, call the My HealtheVet helpdesk at
              877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00
              a.m. to 8 p.m. ET.
            </p>
          )}
          <p>
            If you need to contact your care team now, call your VA health
            facility.
          </p>

          <a href="/find-locations/?page=1&facilityType=health">
            Find your VA health facility
          </a>
        </div>
      )}
    </VaAlert>
  );
};

AlertAccountApiAlert.defaultProps = {
  title: 'Error code 000: Contact the My HealtheVet help desk',
  errorCode: 0,
  recordEvent: recordEventFn,
  testId: 'mhv-alert--mhv-registration',
};

AlertAccountApiAlert.propTypes = {
  errorCode: PropTypes.number,
  title: PropTypes.string,
  headline: PropTypes.string,
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertAccountApiAlert;
