import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LocationDirectionsLink from 'applications/facility-locator/components/search-results/LocationDirectionsLink';
import { titleCase } from '../utils/appointment';

export default function NoValidVAFacilities({
  systemId,
  typeOfCare,
  systemDetails,
}) {
  const attributes = systemDetails?.attributes;
  const address = attributes?.address?.physical;
  const phone = attributes?.phone;
  const hours = attributes?.hours;

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline={`We’re sorry. This location doesn’t allow online scheduling for ${typeOfCare} appointments`}
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
            <LocationDirectionsLink location={systemDetails} hideIcon />
            <div className="vads-u-display--flex vads-u-margin-top--2">
              <span className="vads-u-font-weight--bold">Hours:</span>
              <ul className="usa-unstyled-list vads-u-margin-top--0">
                {hours &&
                  Object.keys(hours).map((day, index) => (
                    <li key={`day-${index}`}>{titleCase(day)}</li>
                  ))}
              </ul>
              <ul className="usa-unstyled-list vads-u-margin-top--0">
                {hours &&
                  Object.keys(hours).map((day, index) => (
                    <li key={`hours-${index}`}>{hours[day]}</li>
                  ))}
              </ul>
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
                <a href={`tel:${phone?.mentalHealthClinic?.replace('-', '')}`}>
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
