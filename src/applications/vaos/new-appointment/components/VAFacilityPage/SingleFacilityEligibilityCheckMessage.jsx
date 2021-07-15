import React from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../../components/ErrorMessage';
import { aOrAn, lowerCase } from '../../../utils/formatters';
import State from '../../../components/State';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';
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
  const directReason = eligibility.directReasons[0];

  if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    directReason === ELIGIBILITY_REASONS.noRecentVisit
  ) {
    const monthRequirement = facility.legacyVAR.settings
      ? (facility.legacyVAR.settings[typeOfCare.id].direct
          .patientHistoryDuration /
          365) *
        12
      : '12-24';
    message = (
      <p>
        To schedule an appointment online at this location, you need to have had{' '}
        {aOrAn(typeOfCareName)} {lowerCase(typeOfCareName)} appointment at this
        facility within the last {monthRequirement} months. Please call this
        facility to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another facility
        </NewTabAnchor>
        .
      </p>
    );
  } else if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    (directReason === ELIGIBILITY_REASONS.noClinics ||
      directReason === ELIGIBILITY_REASONS.noMatchingClinics)
  ) {
    message = (
      <p>
        This facility doesn’t have any available clinics that support online
        scheduling for the type of care you selected. Please call this facility
        to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another facility
        </NewTabAnchor>
        .
      </p>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.error) {
    return <ErrorMessage />;
  } else if (requestReason === ELIGIBILITY_REASONS.noRecentVisit) {
    const monthRequirement = facility.legacyVAR.settings
      ? (facility.legacyVAR.settings[typeOfCare.id].request
          .patientHistoryDuration /
          365) *
        12
      : '12-24';
    message = (
      <>
        <p>
          To request an appointment online at this location, you need to have
          had {aOrAn(typeOfCareName)} {lowerCase(typeOfCareName)} appointment at
          this facility within the last {monthRequirement} months. Please call
          this facility to schedule your appointment or{' '}
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
      <InfoAlert status="warning" headline={title}>
        <p>
          <strong>{facility.name}</strong>
          <br />
          {facility.address?.city}, <State state={facility.address?.state} />
        </p>
        {message}
      </InfoAlert>
    </div>
  );
}
