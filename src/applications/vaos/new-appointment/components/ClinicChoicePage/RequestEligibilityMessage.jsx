import PropTypes from 'prop-types';
import React from 'react';
import ErrorMessage from '../../../components/ErrorMessage';
import InfoAlert from '../../../components/InfoAlert';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import FacilityDetails from '../FacilityDetails';

export default function RequestEligibilityMessage({
  eligibility,
  facilityDetails,
}) {
  const requestReason = eligibility.requestReasons[0];

  if (requestReason === ELIGIBILITY_REASONS.error) {
    return <ErrorMessage />;
  }
  if (
    requestReason === ELIGIBILITY_REASONS.notSupported ||
    requestReason === ELIGIBILITY_REASONS.noRecentVisit
  ) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert
          status="warning"
          headline="We need more information to schedule this appointment"
        >
          <p>
            Call your facility to schedule an appointment at a different clinic.
          </p>
          <FacilityDetails facility={facilityDetails} />
          <p>Or you can choose a different facility.</p>
        </InfoAlert>
      </div>
    );
  }
  if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert
          status="warning"
          headline="You can’t request a different clinic online"
        >
          <p>
            You’ve already requested appointment(s) for this type of care at{' '}
            {facilityDetails.name}. Call your facility for updates or to finish
            scheduling your appointment.
          </p>
          <FacilityDetails facility={facilityDetails} />
          <p>Or you can choose a different facility.</p>
        </InfoAlert>
      </div>
    );
  }

  return <ErrorMessage />;
}

RequestEligibilityMessage.propTypes = {
  eligibility: PropTypes.object.isRequired,
  facilityDetails: PropTypes.object.isRequired,
};
