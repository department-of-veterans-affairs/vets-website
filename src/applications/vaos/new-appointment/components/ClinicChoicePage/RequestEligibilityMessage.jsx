import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from '../../../components/ErrorMessage';
import FacilityAddress from '../../../components/FacilityAddress';
import InfoAlert from '../../../components/InfoAlert';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';

export default function RequestEligibilityMessage({
  eligibility,
  facilityDetails,
  typeOfCare,
  typeOfCareName,
}) {
  const requestReason = eligibility.requestReasons[0];
  const monthRequirement = facilityDetails?.legacyVAR?.settings
    ? (facilityDetails.legacyVAR.settings[typeOfCare.id].request
        .patientHistoryDuration /
        365) *
      12
    : '12-24';

  if (requestReason === ELIGIBILITY_REASONS.error) {
    return <ErrorMessage />;
  }
  if (requestReason === ELIGIBILITY_REASONS.notSupported) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert
          status="warning"
          headline="This facility does not allow online requests for this type of care"
        >
          This facility does not allow scheduling requests for this type of care
          to be made online. Not all facilities support online scheduling for
          all types of care.
        </InfoAlert>
      </div>
    );
  }
  if (requestReason === ELIGIBILITY_REASONS.noRecentVisit) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert
          status="warning"
          headline="We couldn’t find a recent appointment at this location"
        >
          <p>
            You need to have visited this facility within the past{' '}
            {monthRequirement} months for {typeOfCareName} to request an
            appointment for this type of care.
          </p>
          <p>
            Please call the facility to schedule your appointment or search for
            another facility.
          </p>
        </InfoAlert>
      </div>
    );
  }
  if (requestReason === ELIGIBILITY_REASONS.overRequestLimit) {
    return (
      <div aria-atomic="true" aria-live="assertive">
        <InfoAlert
          status="warning"
          headline="You’ve reached the limit for appointment requests at this location"
        >
          <>
            <p>
              Our records show that you have an open appointment request at this
              location. We can’t schedule any more appointments at this facility
              until your open requests are scheduled or canceled. To schedule or
              cancel your open appointments:
            </p>
            <ul>
              <li>
                Go to{' '}
                <va-link
                  href="/my-health/appointments/pending"
                  text="your appointment list"
                  data-testid="appointment-list-link"
                />{' '}
                and cancel open requests, or
              </li>
              {facilityDetails && (
                <li>
                  Call your medical facility:
                  <br />
                  <FacilityAddress
                    name={facilityDetails.name}
                    facility={facilityDetails}
                    level={3}
                  />
                </li>
              )}
              {!facilityDetails && <li>Call your medical facility</li>}
            </ul>
          </>
        </InfoAlert>
      </div>
    );
  }

  return <ErrorMessage />;
}

RequestEligibilityMessage.propTypes = {
  eligibility: PropTypes.object.isRequired,
  facilityDetails: PropTypes.object.isRequired,
  typeOfCare: PropTypes.object.isRequired,
  typeOfCareName: PropTypes.string.isRequired,
};
