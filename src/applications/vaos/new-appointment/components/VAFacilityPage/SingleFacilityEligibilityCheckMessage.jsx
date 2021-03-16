import React from 'react';
import { Link } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import ErrorMessage from '../../../components/ErrorMessage';
import { aOrAn, lowerCase } from '../../../utils/formatters';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
}) {
  let title =
    'We found one facility that accepts online scheduling for this care';
  let message;

  if (eligibility.requestFailed) {
    return <ErrorMessage />;
  }

  if (!eligibility.requestPastVisit) {
    message = (
      <>
        <p>
          To request an appointment online at this location, you need to have
          had {aOrAn(typeOfCare)} {lowerCase(typeOfCare)} appointment at this
          facility within the last {eligibility.requestPastVisitValue} months.
        </p>
        <p>
          You’ll need to call the facility to schedule this appointment. Or{' '}
          <NewTabAnchor href="/find-locations">
            search for another VA facility
          </NewTabAnchor>
          .
        </p>
      </>
    );
  } else if (!eligibility.requestSupported) {
    title =
      'The facility we found doesn’t accept online scheduling for this care';
    message = (
      <>
        <p>
          You’ll need to call this facility to request your appointment. Not all
          VA facilities offer online scheduling for all types of care.
        </p>
        <p>
          If this isn’t the facility you’re looking for, you can{' '}
          <NewTabAnchor href="/find-locations">
            search for another VA facility
          </NewTabAnchor>
        </p>
      </>
    );
  } else if (!eligibility.requestLimit) {
    message = (
      <>
        <p>
          Before requesting an appointment at this location, you need to
          schedule or cancel your open appointment requests at this facility.
        </p>
        <p>
          Call this facility to schedule or cancel a request. You can also
          cancel a request from <Link to="/">your appointment list</Link>
        </p>
      </>
    );
  } else {
    return <ErrorMessage />;
  }

  return (
    <div aria-atomic="true" aria-live="assertive">
      <AlertBox status="warning" headline={title}>
        <p>
          <strong>{facility.name}</strong>
          <br />
          {facility.address?.city}, <State state={facility.address?.state} />
        </p>
        {message}
      </AlertBox>
    </div>
  );
}
