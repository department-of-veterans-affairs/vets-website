import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function VAFacilityInfoMessage({ facility, eligibility }) {
  let message;

  if (!eligibility.requestPastVisit) {
    message = (
      <>
        However, in order to request an appointment at this facility for the
        chosen type of care, you need to have been seen within the past{' '}
        {eligibility.requestPastVisitValue} months.
      </>
    );
  } else if (!eligibility.requestSupported) {
    message = (
      <>
        However, this facility does not allow online requests for this type of
        care.
      </>
    );
  } else if (!eligibility.requestLimit) {
    message = (
      <>
        However, you have more outstanding requests than this facility allows
        for this type of care.
      </>
    );
  } else {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <AlertBox status="error" headline="Sorry, something went wrong">
          Sorry, we're having trouble verifying that you can make an appointment
          at a facility.
        </AlertBox>
      </div>
    );
  }

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox status="warning" headline="We found one VA location for you">
        <p>
          <strong>{facility.authoritativeName}</strong>
          <br />
          {facility.city}, {facility.stateAbbrev}
        </p>
        {message}
        <p>
          If this location wasn't what you were looking for, you can{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            search for a nearby location
          </a>{' '}
          and call to schedule an appointment.
        </p>
      </AlertBox>
    </div>
  );
}
