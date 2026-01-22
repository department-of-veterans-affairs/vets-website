import recordEvent from 'platform/monitoring/record-event';
import React from 'react';
import { useSelector } from 'react-redux';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import PostFormFieldContent from '../../../components/PostFormFieldContent';
import { selectFeatureImmediateCareAlert } from '../../../redux/selectors';

export default function TypeOfCareAlert() {
  const featureImmediateCareAlert = useSelector(
    selectFeatureImmediateCareAlert,
  );
  const content = featureImmediateCareAlert
    ? 'You’ll need to call your local VA health care facility to schedule an appointment.'
    : 'You’ll need to call your VA health facility to schedule an appointment.';
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
                'alert-box-click-label': 'Find a VA location',
              })
            }
            renderAriaLabel={false}
          >
            {featureImmediateCareAlert
              ? 'Find your local VA health care facility (opens in a new tab)'
              : 'Find a VA location (opens in a new tab)'}
          </NewTabAnchor>
        </p>
      </InfoAlert>
    </PostFormFieldContent>
  );
}
