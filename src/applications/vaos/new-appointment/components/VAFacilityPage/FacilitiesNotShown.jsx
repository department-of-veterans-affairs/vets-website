import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from '../../../utils/constants';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function FacilitiesNotShown({ sortMethod }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(
    () => {
      setIsOpen(false);
    },
    [sortMethod],
  );
  useEffect(
    () => {
      if (isOpen) {
        recordEvent({
          event: `${GA_PREFIX}-facilities-not-listed-click`,
        });
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
FacilitiesNotShown.propTypes = {
  cernerSiteIds: PropTypes.array,
  facilities: PropTypes.array,
  sortMethod: PropTypes.string,
  typeOfCareId: PropTypes.string,
};
