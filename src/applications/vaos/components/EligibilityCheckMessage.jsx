import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function EligibilityCheckMessage({ eligibility }) {
  if (!eligibility.requestSupported) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <AlertBox
          status="warning"
          headline="This facility does not allow online requests for this type of care"
        >
          This facility does not allow scheduling requests for this type of care
          to be made online. Not all facilities support online scheduling for
          all types of care.
        </AlertBox>
      </div>
    );
  }
  if (!eligibility.requestPastVisit) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <AlertBox
          status="warning"
          headline="We couldn’t find a recent appointment at this location"
        >
          <p>
            You need to have visited this facility within the past{' '}
            {eligibility.requestPastVisitValue} months to request an appointment
            online for the type of care you selected.
          </p>
          <p>
            If you haven’t visited this location within the past{' '}
            {eligibility.requestPastVisitValue} months, please call this
            facility to schedule your appointment or search for another
            facility.
          </p>
        </AlertBox>
      </div>
    );
  }
  if (!eligibility.requestLimit) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <AlertBox
          status="warning"
          headline="You already have an appointment request at this location"
        >
          Our records show that you have an open appointment request at this
          location. We can’t schedule any more appointments at this facility
          until the open appointment requests are scheduled or canceled.
        </AlertBox>
      </div>
    );
  }

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox status="warning" headline="Sorry, something went wrong">
        Sorry, we're having trouble verifying that you can make an appointment
        at this facility. Please try another facility.
      </AlertBox>
    </div>
  );
}
