import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import FacilityAddress from './FacilityAddress';
import FacilityHours from './FacilityHours';
import { FETCH_STATUS } from '../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { lowerCase } from '../utils/formatters';

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
                <div className="vads-u-display--flex vads-u-margin-top--2">
                  <FacilityHours location={parentDetails} />
                </div>
              </div>
            ) : (
              <p>
                You can find contact information for this medical center at{' '}
                <a
                  href={`/find-locations/facility/vha_${siteId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  our facility locator tool
                </a>
                .
              </p>
            )}
          </>
        }
      />
    </div>
  );
}
