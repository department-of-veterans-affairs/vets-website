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
        <>
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinic.friendlyName} at
          <Telephone contact={clinic.phoneNumber} /> or {facility.displayName}{' '}
          at <Telephone contact={facility.phoneNumber} />.
        </>
      );
    } else if (clinic && clinic.phoneNumber) {
      return (
        <>
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {clinic.friendlyName} at{' '}
          <Telephone contact={clinic.phoneNumber} />.
        </>
      );
    } else if (facility && facility.phoneNumber) {
      return (
        <>
          If you have questions about your upcoming appointment, please call
          your VA provider. You can contact them at {facility.displayName} at{' '}
          <Telephone contact={facility.phoneNumber} />.
        </>
      );
    } else {
      return (
        <>
          If you have questions about your upcoming appointment,{' '}
          <a href={`/find-locations/facility/vha_${facilityId}`}>
            please call your VA provider
          </a>
        </>
      );
    }
  };

  return (
    <div className="next-steps">
      <h2>
        Who can I contact if I have questions about my upcoming appointment?
      </h2>
      <p>
        <PhoneNumbers />
      </p>
      <div className="nav-buttons">
        <a
          className="usa-button-primary"
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
