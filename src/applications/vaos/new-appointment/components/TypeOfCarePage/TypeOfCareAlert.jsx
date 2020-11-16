import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';

export default function TypeOfCareAlert() {
  const headline = 'Not seeing the type of care you need?';
  return (
    <AlertBox
      status="info"
      headline={headline}
      className="vads-u-margin-top--3 vads-u-margin-bottom--7"
      content={
        <p>
          You’ll need to call your VA health facility to schedule an
          appointment. <br />
          <a
            href="/find-locations"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              recordEvent({
                event: 'nav-alert-box-link-click',
                'alert-box-type': 'informational',
                'alert-box-heading': 'Not seeing the type of care you need',
                'alert-box-subheading': undefined,
                'alert-box-click-label': 'Find a VA location',
              })
            }
          >
            Find a VA location
          </a>
        </p>
      }
    />
  );
}
