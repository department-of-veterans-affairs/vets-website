import React from 'react';
import { Link } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import ErrorMessage from '../../../components/ErrorMessage';
import { aOrAn, lowerCase } from '../../../utils/formatters';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';

export default function SingleFacilityEligibilityCheckMessage({
  facility,
  eligibility,
  typeOfCare,
  typeOfCareName,
}) {
  let title =
    'We found one facility that accepts online scheduling for this care';
  let message;
  const requestReason = eligibility.requestReasons[0];
  const monthRequirement = facility.legacyVAR.settings
    ? (facility.legacyVAR.settings[typeOfCare.id].request
        .patientHistoryDuration /
        365) *
      12
    : '12-24';

  if (requestReason === ELIGIBILITY_REASONS.error) {
    return <ErrorMessage />;
  }

  if (requestReason === ELIGIBILITY_REASONS.noRecentVisit) {
    message = (
      <>
        <p>
          To request an appointment online at this location, you need to have
          had {aOrAn(typeOfCareName)} {lowerCase(typeOfCareName)} appointment at
          this facility within the last {monthRequirement} months.
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
  } else if (requestReason === ELIGIBILITY_REASONS.notSupported) {
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
  } else if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
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
