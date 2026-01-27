import React from 'react';
import PropTypes from 'prop-types';
import { getFacilityPhone } from '../../../services/location';
import FacilityPhone from '../../../components/FacilityPhone';
import RequestAppointmentLink from './RequestAppointmentLink';

export default function ScheduleWithDifferentProvider({
  isEligibleForRequest,
  overRequestLimit,
  selectedFacility,
  hasProviders = true,
  patientRelationshipsError = false,
  requestEligibilityError = false,
  pageKey = 'selectProvider',
}) {
  const facilityPhone = getFacilityPhone(selectedFacility);

  const title = hasProviders
    ? 'If you want to schedule with a different provider'
    : 'How to schedule';

  // If there is an endpoint error, return null
  if (patientRelationshipsError) {
    return null;
  }

  // if request eligibility endpoint returns an error, ELIGIBILITY_REASONS.error
  if (requestEligibilityError) {
    return (
      <>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
          {title}
        </h2>
        <p className="vads-u-margin-y--0">
          Call the facility and ask to schedule with that provider:{' '}
          <FacilityPhone contact={facilityPhone} icon={false} />
        </p>
        <hr
          aria-hidden="true"
          className="vads-u-margin-y--2 vads-u-border-color--gray-medium"
        />
      </>
    );
  }

  // now under title text is handled in the no available providers info section
  if (overRequestLimit || !isEligibleForRequest) {
    return null;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        {title}
      </h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1">
        Option 1: Request your preferred date and time online
      </h3>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        We’ll contact you within 2 business days after we receive your request
        to help you finish scheduling your appointment.
      </p>
      <RequestAppointmentLink pageKey={pageKey} />
      <h3
        className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--3"
        data-testid="cc-eligible-header"
      >
        Option 2: Call the facility
      </h3>
      <p className="vads-u-margin-y--0">
        Call and ask to schedule with that provider:{' '}
        <FacilityPhone contact={facilityPhone} icon={false} />
      </p>
      <hr
        aria-hidden="true"
        className="vads-u-margin-y--2 vads-u-border-color--gray-medium"
      />
    </>
  );
}

ScheduleWithDifferentProvider.propTypes = {
  isEligibleForRequest: PropTypes.bool.isRequired,
  overRequestLimit: PropTypes.bool.isRequired,
  selectedFacility: PropTypes.object.isRequired,
  hasProviders: PropTypes.bool,
  pageKey: PropTypes.string,
  patientRelationshipsError: PropTypes.bool,
  requestEligibilityError: PropTypes.bool,
};
