import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import State from '../../../components/State';
import FacilityPhone from '../../../components/FacilityPhone';
import { lowerCase } from '../../../utils/formatters';

export default function NoValidVAFacilities({
  facilities,
  sortMethod,
  typeOfCare,
  address,
}) {
  // We're showing the two closest facilities if we have an address to sort by,
  // otherwise we're showing the first 5 facilities in alpha order
  const facilityLimit = address?.addressLine1 ? 2 : 5;
  const unsupportedFacilities = facilities
    ?.filter(
      facility =>
        !facility.legacyVAR.directSchedulingSupported[typeOfCare.id] &&
        !facility.legacyVAR.requestSupported[typeOfCare.id],
    )
    ?.slice(0, facilityLimit);

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox
        status="warning"
        headline="We couldn’t find a VA facility"
        level="2"
        content={
          <>
            <p>
              None of the facilities <strong>where you receive care</strong>{' '}
              accepts{' '}
              <strong>
                online appointments for {lowerCase(typeOfCare?.name)}
              </strong>
              .
            </p>
            <h3 className="vads-u-font-size--h4" id="what_you_can_do">
              What you can do
            </h3>
            <ul aria-labelledby="what_you_can_do">
              {unsupportedFacilities?.length > 0 && (
                <li>
                  Some clinics don’t offer online scheduling. You can call them
                  directly to schedule your appointment:
                  <ul className="usa-unstyled-list vads-u-margin-top--2">
                    {unsupportedFacilities.map(facility => (
                      <li key={facility.id} className="vads-u-margin-bottom--2">
                        <strong>{facility.name}</strong>
                        <br />
                        {facility.address?.city},{' '}
                        <State state={facility.address?.state} />
                        <br />
                        {!!facility.legacyVAR[sortMethod] && (
                          <>
                            {facility.legacyVAR[sortMethod]} miles
                            <br />
                          </>
                        )}
                        Main phone:{' '}
                        <FacilityPhone
                          contact={
                            facility.telecom.find(t => t.system === 'phone')
                              ?.value
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              <li>
                <a
                  href="/find-locations"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Or, find a different VA location
                </a>
              </li>
            </ul>
          </>
        }
      />
    </div>
  );
}
