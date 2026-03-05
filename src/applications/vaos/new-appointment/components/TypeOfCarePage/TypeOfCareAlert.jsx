import recordEvent from 'platform/monitoring/record-event';
import React from 'react';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import PostFormFieldContent from '../../../components/PostFormFieldContent';

export default function TypeOfCareAlert() {
  const content =
    'You’ll need to call your local VA health care facility to schedule an appointment.';
  const headline = 'Is the type of care you need not listed here?';

  return (
    <PostFormFieldContent>
      <InfoAlert
        status="info"
        headline={headline}
        level="2"
        className="vads-u-margin-top--3 vads-u-margin-bottom--7"
      >
        <p>
          {content} <br />
          <NewTabAnchor
            href="/find-locations"
            onClick={() =>
              recordEvent({
                event: 'nav-alert-box-link-click',
                'alert-box-type': 'informational',
                'alert-box-heading':
                  'Is the type of care you need not listed here',
                'alert-box-subheading': undefined,
                'alert-box-click-label':
                  'Find your local VA health care facility',
              })
            }
            renderAriaLabel={false}
          >
            Find your local VA health care facility (opens in a new tab)
          </NewTabAnchor>
        </p>
      </InfoAlert>
    </PostFormFieldContent>
  );
}
