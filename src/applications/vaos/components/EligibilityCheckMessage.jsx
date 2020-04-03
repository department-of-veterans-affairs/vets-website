import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorMessage from './ErrorMessage';
import FacilityAddress from './FacilityAddress';

export default function EligibilityCheckMessage({
  eligibility,
  facilityDetails,
}) {
  if (eligibility.requestFailed) {
    return <ErrorMessage />;
  }
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
          headline="You’ve reached the limit for appointment requests at this location"
          content={
            <>
              <p>
                Our records show that you have an open appointment request at
                this location. We can’t schedule any more appointments at this
                facility until your open requests are scheduled or canceled. To
                schedule or cancel your open appointments:
              </p>
              <ul>
                <li>
                  Go to <Link to="/">your appointment list</Link> and cancel
                  open requests, or
                </li>
                {facilityDetails && (
                  <li>
                    Call your medical facility:
                    <br />
                    <FacilityAddress
                      name={facilityDetails.name}
                      facility={facilityDetails}
                    />
                  </li>
                )}
                {!facilityDetails && <li>Call your medical facility</li>}
              </ul>
            </>
          }
        />
      </div>
    );
  }

  return <ErrorMessage />;
}
