import * as React from 'react';
const { useEffect } = React
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/mhv/utilities';
import recordEventFn from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  VaAlert,
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';

export const defaultProps = {
  headline: 'Our records don’t show any VA health data for you right now',
  recordEvent: recordEventFn,
  ssoe: false,
  testId: 'mhv-alert--unregistered',
};

interface AlertUnregisteredProps {
  headline: string;
  recordEvent?: (event) => void;
  ssoe: boolean;
  testId?: string;
}

const AlertUnregistered = ({
  headline = defaultProps.headline,
  recordEvent = defaultProps.recordEvent,
  ssoe = defaultProps.ssoe,
  testId = defaultProps.testId
}: AlertUnregisteredProps): JSX.Element => {
  const mhvHomeUrl = mhvUrl(ssoe, 'home');

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
      datadogRum.addAction('Showed Alert Box: Unregistered');
    },
    [headline, recordEvent],
  );

  return (
    <VaAlert status="warning" data-testid={testId} disableAnalytics>
      <h2 slot="headline">{headline}</h2>
      <div>
        <p>
          This could be because you haven’t received care at a VA health
          facility. Or there could be a problem with our records.
        </p>
        <p>
          <strong>If you’ve received care at a VA health facility</strong>, call
          us at <VaTelephone contact="877-327-0022" /> (
          <VaTelephone contact="800-877-8339" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. Ask
          the representative to confirm in your records that you’re registered
          at a VA health facility.{' '}
          <strong>
            They can then help fix the problem or connect you with your facility
            to register.
          </strong>
        </p>
        <p>
          <strong>
            If you haven’t received care at a VA facility and you’ve used My
            HealtheVet in the past to keep track of your own personal health
            data
          </strong>
          , you can continue to use the previous version of My HealtheVet at
          this time. Please know that we’ll soon be retiring self-entered data
          from the My HealtheVet experience.
        </p>
        <p>
          <VaLink
            href={mhvHomeUrl}
            text="Go to the previous version of My HealtheVet"
          />
        </p>
      </div>
    </VaAlert>
  );
};

export default AlertUnregistered;
