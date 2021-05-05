import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import FacilityAddress from '../../../components/FacilityAddress';
import FacilityHours from '../../../components/FacilityHours';
import { FETCH_STATUS } from '../../../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { lowerCase } from '../../../utils/formatters';
import { getRealFacilityId } from '../../../utils/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function NoValidVAFacilities({ formContext }) {
  const {
    siteId,
    typeOfCare,
    facilityDetailsStatus,
    parentDetails,
  } = formContext;

  if (facilityDetailsStatus === FETCH_STATUS.loading) {
    return <LoadingIndicator message="Finding locations" />;
  }

  const typeOfCareText = typeOfCare ? lowerCase(typeOfCare) : '';

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`There are no ${typeOfCareText} appointments at this location`}
        content={
          <>
            <p>
              We’re sorry. This medical center and associated clinics don’t
              allow online appointments for this type of care. Please call the
              medical center for more information.
            </p>
            {parentDetails ? (
              <div className="vads-u-padding-left--2 vads-u-border-left--4px vads-u-border-color--primary">
                <FacilityAddress
                  name={parentDetails.name}
                  facility={parentDetails}
                  showDirectionsLink
                />
                {!!parentDetails?.hoursOfOperation && (
                  <div className="vads-u-display--flex vads-u-margin-top--2">
                    <FacilityHours
                      hoursOfOperation={parentDetails.hoursOfOperation}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p>
                You can find contact information for this medical center at{' '}
                <NewTabAnchor
                  href={`/find-locations/facility/vha_${getRealFacilityId(
                    siteId,
                  )}`}
                >
                  our facility locator tool
                </NewTabAnchor>
                .
              </p>
            )}
          </>
        }
      />
    </div>
  );
}
