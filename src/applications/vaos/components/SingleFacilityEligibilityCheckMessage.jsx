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
  }

  if (!eligibility.requestLimit) {
    message = (
      <>
        However, there's already an oustanding request for an appointment at
        this facility for the chosen type of care.
      </>
    );
  }

  return (
    <AlertBox status="warning" headline="We found one VA location for you">
      <p>
        <strong>{facility.institution.authoritativeName}</strong>
        <br />
        {facility.institution.city}, {facility.institution.stateAbbrev}
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
  );
}
