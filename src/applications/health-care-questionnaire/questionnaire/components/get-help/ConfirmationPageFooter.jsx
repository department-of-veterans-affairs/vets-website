import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import {
  getClinicFromAppointment,
  getFacilityFromAppointment,
} from '../../utils';

export default function ConfirmationPageFooter(props) {
  const { appointment } = props;

  const PhoneNumbers = () => {
    const clinic = getClinicFromAppointment(appointment);
    const facility = getFacilityFromAppointment(appointment);
    const facilityId = appointment.attributes.facilityId;
    if (clinic && clinic.phoneNumber && facility && facility.phoneNumber) {
      return (
        <span data-testid="full-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinic.friendlyName} at{' '}
          <Telephone contact={clinic.phoneNumber} /> or {facility.displayName}{' '}
          at <Telephone contact={facility.phoneNumber} />.
        </span>
      );
    } else if (clinic && clinic.phoneNumber) {
      return (
        <span data-testid="clinic-only-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinic.friendlyName} at{' '}
          <Telephone contact={clinic.phoneNumber} />.
        </span>
      );
    } else if (facility && facility.phoneNumber) {
      return (
        <span data-testid="facility-only-details">
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {facility.displayName} at{' '}
          <Telephone contact={facility.phoneNumber} />.
        </span>
      );
    } else {
      return (
        <span data-testid="default-details">
          If you have questions about your upcoming appointment, please call
          your VA provider.{' '}
          <a href={`/find-locations/facility/vha_${facilityId}`}>
            Contact your VA provider
          </a>
          .
        </span>
      );
    }
  };

  return (
    <div className="next-steps">
      <h2>What if I have questions about my appointment?</h2>
      <p>
        <PhoneNumbers />
      </p>
      <div className="nav-buttons">
        <a
          className="questionnaire-link usa-button-primary usa-button-secondary"
          href="/health-care/health-questionnaires/questionnaires"
        >
          Go to your health questionnaires
        </a>
        <a
          className="appointment-details-link usa-button-primary usa-button-secondary"
          href="/health-care/schedule-view-va-appointments/appointments/"
        >
          Go to your appointment details
        </a>
      </div>
    </div>
  );
}
