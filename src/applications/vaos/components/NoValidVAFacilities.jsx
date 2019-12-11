import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import FacilityDirectionsLink from './FacilityDirectionsLink';
import FacilityHours from './FacilityHours';
import { FETCH_STATUS } from '../utils/constants';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

export default function NoValidVAFacilities({ formContext }) {
  const {
    systemId,
    typeOfCare,
    facilityDetailsStatus,
    systemDetails,
  } = formContext;

  if (facilityDetailsStatus === FETCH_STATUS.loading) {
    return <LoadingIndicator message="Finding locations" />;
  }

  const attributes = systemDetails?.attributes;
  const address = attributes?.address?.physical;
  const phone = attributes?.phone;

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`We’re sorry. None of the facilities in this health system allow online scheduling for ${typeOfCare} appointments`}
      >
        <p>
          You can’t schedule this type of appointment online. Please call the
          medical center for more information.
        </p>
        {systemDetails ? (
          <div className="vads-u-padding-left--2 vads-u-border-left--4px vads-u-border-color--primary">
            <span className="vads-u-font-weight--bold">{attributes?.name}</span>
            <br />
            <span>{address?.address1}</span>
            <br />
            {!!address?.address2 && (
              <>
                <span>{address?.address2}</span>
                <br />
              </>
            )}
            <span>
              {address?.city}, {address?.state} {address?.zip}
            </span>
            <br />
            <FacilityDirectionsLink location={systemDetails} />
            <div className="vads-u-display--flex vads-u-margin-top--2">
              <FacilityHours location={systemDetails} />
            </div>
            <p>
              <span className="vads-u-font-weight--bold">Main phone: </span>
              <a href={`tel:${phone?.main?.replace('-', '')}`}>{phone?.main}</a>
            </p>
            {!!phone?.mentalHealthClinic && (
              <p>
                <span className="vads-u-font-weight--bold">
                  Mental health phone:{' '}
                </span>
                <a href={`tel:${phone.mentalHealthClinic.replace('-', '')}`}>
                  {phone?.mentalHealthClinic}
                </a>
              </p>
            )}
          </div>
        ) : (
          <p>
            You can find contact information for this medical center at{' '}
            <a
              href={`/find-locations/facility/vha_${systemId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              our facility locator tool
            </a>
            .
          </p>
        )}
      </AlertBox>
    </div>
  );
}
