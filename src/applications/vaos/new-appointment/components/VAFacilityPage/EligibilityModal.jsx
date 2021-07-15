import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { ELIGIBILITY_REASONS, FETCH_STATUS } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';
import { aOrAn, lowerCase } from '../../../utils/formatters';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
  typeOfCare,
}) {
  let title;
  let content;
  const requestReason = eligibility.requestReasons[0];
  const directReason = eligibility.directReasons[0];

  if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    directReason === ELIGIBILITY_REASONS.noRecentVisit
  ) {
    const monthRequirement = facilityDetails?.legacyVAR?.settings
      ? (facilityDetails.legacyVAR.settings[typeOfCare.id].direct
          .patientHistoryDuration /
          365) *
        12
      : '12-24';

    title = 'We couldn’t find a recent appointment at this location';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        To schedule an appointment online at this location, you need to have had{' '}
        {aOrAn(typeOfCare?.name)} {lowerCase(typeOfCare?.name)} appointment at
        this facility within the last {monthRequirement} months. Please call
        this facility to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another VA facility
        </NewTabAnchor>
        .
      </div>
    );
  } else if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    (directReason === ELIGIBILITY_REASONS.noClinics ||
      directReason === ELIGIBILITY_REASONS.noMatchingClinics)
  ) {
    title = 'We couldn’t find a clinic for this type of care';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        We're sorry. This facility doesn't have any available clinics that
        support online scheduling for the type of care you selected. Please call
        this facility to schedule your appointment or search for another
        facility.
      </div>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.error) {
    title = 'We’re sorry. We’ve run into a problem';
    content = 'Something went wrong on our end. Please try again later.';
  } else if (requestReason === ELIGIBILITY_REASONS.notSupported) {
    title = 'This facility doesn’t accept online scheduling for this care';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        You’ll need to call your VA health facility to schedule this
        appointment. Not all VA facilities offer online scheduling for all types
        of care.
      </div>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.noRecentVisit) {
    const monthRequirement =
      (facilityDetails.legacyVAR.settings[typeOfCare.id].request
        .patientHistoryDuration /
        365) *
      12;
    title = 'We can’t find a recent appointment for you';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        To request an appointment online at this location, you need to have had{' '}
        {aOrAn(typeOfCare?.name)} {lowerCase(typeOfCare?.name)} appointment at
        this facility within the last {monthRequirement} months. Please call
        this facility to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another VA facility
        </NewTabAnchor>
        .
      </div>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
    title = 'You’ve reached the limit for appointment requests';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        <p>
          Our records show that you have an open appointment request at this
          location. You can’t request another appointment until you schedule or
          cancel your open requests.
        </p>
        <p>
          Call this facility to schedule or cancel an open appointment request.
          You can also cancel a request from{' '}
          <Link to="/">your appointment list</Link>.
        </p>
        {facilityDetails && (
          <FacilityAddress
            name={facilityDetails.name}
            facility={facilityDetails}
          />
        )}
      </div>
    );
  }

  return (
    <Modal
      id="eligibilityModal"
      status="warning"
      visible
      onClose={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      title={title}
    >
      <div aria-atomic="true" aria-live="assertive">
        {content}
      </div>
    </Modal>
  );
}
