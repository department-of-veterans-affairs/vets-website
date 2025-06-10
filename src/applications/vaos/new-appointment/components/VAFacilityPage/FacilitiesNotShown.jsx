import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import React, { useEffect, useState } from 'react';
import NewTabAnchor from '../../../components/NewTabAnchor';
import { GA_PREFIX } from '../../../utils/constants';

export default function FacilitiesNotShown() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(
    () => {
      if (isOpen) {
        recordEvent({ event: `${GA_PREFIX}-facilities-not-listed-click` });
      }
    },
    [isOpen],
  );

  return (
    <div className="vads-u-margin-bottom--7">
      <div className="additional-info-content">
        <va-additional-info
          data-testid="facility-not-listed"
          trigger="If you can't find your facility on the list"
          onClick={() => setIsOpen(!isOpen)}
          uswds
        >
          <p className="vads-u-margin-top--0">
            Call your facility and confirm that you're registered as a patient.{' '}
          </p>
          <NewTabAnchor
            href="/find-locations"
            onClick={() =>
              recordEvent({
                event: `${GA_PREFIX}-facilities-not-listed-locator-click`,
              })
            }
          >
            Find your VA health facility (opens in new tab)
          </NewTabAnchor>
        </va-additional-info>
      </div>
    </div>
  );
}
