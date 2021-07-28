import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import PostFormFieldContent from '../../../components/PostFormFieldContent';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function TypeOfCareAlert() {
  const headline = 'Not seeing the type of care you need?';
  return (
    <PostFormFieldContent>
      <InfoAlert
        status="info"
        headline={headline}
        level="2"
        className="vads-u-margin-top--3 vads-u-margin-bottom--7"
      >
        <p>
          You’ll need to call your VA health facility to schedule an
          appointment. <br />
          <NewTabAnchor
            href="/find-locations"
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
          </NewTabAnchor>
        </p>
      </InfoAlert>
    </PostFormFieldContent>
  );
}
