import PropTypes from 'prop-types';
import React from 'react';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import FacilityDetails from '../FacilityDetails';

export default function getEligibilityMessage({
  eligibility,
  facilityDetails,
}) {
  let content = null;
  let title = null;
  let status;

  const requestReason = eligibility.requestReasons[0];
  const directReason = eligibility.directReasons[0];

  if (
    (requestReason === ELIGIBILITY_REASONS.notSupported &&
      directReason === ELIGIBILITY_REASONS.noRecentVisit) ||
    requestReason === ELIGIBILITY_REASONS.noRecentVisit
  ) {
    title = 'You can’t schedule an appointment online';

    content = (
      <>
        <p>
          You haven’t had a recent appointment at this facility. You’ll need to
          call to schedule, instead.
        </p>
        <FacilityDetails facility={facilityDetails} />
        <p>Or you can choose a different facility.</p>
      </>
    );
  } else if (
    requestReason === ELIGIBILITY_REASONS.notSupported &&
    (directReason === ELIGIBILITY_REASONS.noClinics ||
      directReason === ELIGIBILITY_REASONS.noMatchingClinics)
  ) {
    title = 'You can’t schedule this appointment online';

    content = (
      <>
        <p>
          We couldn’t find any open appointment times for online scheduling.
        </p>
        <p>You’ll need to call the facility to schedule an appointment.</p>
        <FacilityDetails facility={facilityDetails} />
        <p>Or you can go back and choose a different facility.</p>
      </>
    );
  } else if (
    directReason === ELIGIBILITY_REASONS.error ||
    requestReason === ELIGIBILITY_REASONS.error
  ) {
    title = 'You can’t schedule an appointment online right now';
    content =
      'We’re sorry. There’s a problem with our system. Try again later.';
    status = 'error';
  } else if (requestReason === ELIGIBILITY_REASONS.notSupported) {
    title = 'This facility doesn’t accept online scheduling for this care';
    content = (
      <>
        You’ll need to call your VA health facility to schedule this
        appointment. Not all VA facilities offer online scheduling for all types
        of care.
      </>
    );
  } else if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
    title = 'You can’t schedule this appointment online';

    content = (
      <>
        <p>You’ll need to call to schedule at this facility.</p>
        <FacilityDetails facility={facilityDetails} />
        <p>Or you can choose a different facility.</p>
      </>
    );
  }

  if (title === null || content === null) {
    throw new Error('Missing eligibility display reason');
  }

  return { title, content, status };
}
getEligibilityMessage.propTypes = {
  eligibility: PropTypes.object,
  facilityDetails: PropTypes.object,
  includeFacilityContactInfo: PropTypes.bool,
  typeOfCare: PropTypes.object,
};
