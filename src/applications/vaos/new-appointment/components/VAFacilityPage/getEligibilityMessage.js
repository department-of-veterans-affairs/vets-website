import React from 'react';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import { aOrAn, lowerCase } from '../../../utils/formatters';
import NewTabAnchor from '../../../components/NewTabAnchor';
import FacilityAddress from '../../../components/FacilityAddress';

export default function getEligibilityMessage({
  typeOfCare,
  eligibility,
  facilityDetails,
  includeFacilityContactInfo = false,
}) {
  let content = null;
  let title = null;
  const settings = facilityDetails?.legacyVAR?.settings?.[typeOfCare.id];

  const requestReason = eligibility.requestReasons[0];
  const directReason = eligibility.directReasons[0];

  if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    directReason === ELIGIBILITY_REASONS.noRecentVisit
  ) {
    const monthRequirement = settings?.direct?.patientHistoryDuration
      ? (settings.direct.patientHistoryDuration / 365) * 12
      : '24';

    title = 'We couldn’t find a recent appointment at this location';
    content = (
      <>
        To schedule an appointment online at this location, you need to have had{' '}
        {aOrAn(typeOfCare?.name)} {lowerCase(typeOfCare?.name)} appointment at
        this facility within the last {monthRequirement} months. Please call
        this facility to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another VA facility
        </NewTabAnchor>
        .
      </>
    );
  } else if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    (directReason === ELIGIBILITY_REASONS.noClinics ||
      directReason === ELIGIBILITY_REASONS.noMatchingClinics)
  ) {
    title = 'We couldn’t find a clinic for this type of care';
    content = (
      <>
        We're sorry. This facility doesn’t have any available clinics that
        support online scheduling for the type of care you selected. Please call
        this facility to schedule your appointment or search for another
        facility.
      </>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.error) {
    title = 'We’re sorry. We’ve run into a problem';
    content = 'Something went wrong on our end. Please try again later.';
  } else if (requestReason === ELIGIBILITY_REASONS.notSupported) {
    title = 'This facility doesn’t accept online scheduling for this care';
    content = (
      <>
        You’ll need to call your VA health facility to schedule this
        appointment. Not all VA facilities offer online scheduling for all types
        of care.
      </>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.noRecentVisit) {
    const monthRequirement = settings?.request?.patientHistoryDuration
      ? (settings.request.patientHistoryDuration / 365) * 12
      : '24';
    title = 'We can’t find a recent appointment for you';
    content = (
      <>
        To request an appointment online at this location, you need to have had{' '}
        {aOrAn(typeOfCare?.name)} {lowerCase(typeOfCare?.name)} appointment at
        this facility within the last {monthRequirement} months. Please call
        this facility to schedule your appointment or{' '}
        <NewTabAnchor href="/find-locations">
          search for another VA facility
        </NewTabAnchor>
        .
      </>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
    title = 'You’ve reached the limit for appointment requests';
    content = (
      <>
        <p>
          Our records show that you have an open appointment request at this
          location. You can’t request another appointment until you schedule or
          cancel your open requests.
        </p>
        <p>
          Call this facility to schedule or cancel an open appointment request.
          You can also cancel a request from{' '}
          <va-link
            href="/my-health/appointments/pending"
            text="your appointment list"
            data-testid="appointment-list-link"
          />
          .
        </p>
        {facilityDetails &&
          includeFacilityContactInfo && (
            <FacilityAddress
              name={facilityDetails.name}
              facility={facilityDetails}
              level={2}
            />
          )}
      </>
    );
  }

  if (title === null || content === null) {
    throw new Error('Missing eligibility display reason');
  }

  return { title, content };
}
