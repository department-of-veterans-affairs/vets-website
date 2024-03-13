import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SingleFacilityBody = ({ facility, appointments }) => {
  const { t } = useTranslation();
  const formatAppointment = appointment => {
    const appointmentLabel = appointment.clinicStopCodeName
      ? `${appointment.clinicStopCodeName} ${t('appointment')}`
      : t('VA-appointment');
    const providerLabel =
      appointment.doctorName && ` with ${appointment.doctorName}`;
    return `${appointmentLabel}${providerLabel}`;
  };
  return (
    <div
      className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding-y--1 vads-u-margin-y--4 vads-u-border-color--gray-light"
      data-testid="single-fac-context"
    >
      <span className="vads-u-font-weight--bold">{facility}</span>
      <div className="vads-u-margin-y--1">
        {appointments.map(appointment => (
          <p
            className="vads-u-margin--0"
            key={appointment.appointmentIen}
            data-testid={`appointment-list-item-${appointment.appointmentIen}`}
          >
            {formatAppointment(appointment)}
          </p>
        ))}
      </div>
    </div>
  );
};

SingleFacilityBody.propTypes = {
  appointments: PropTypes.array.isRequired,
  facility: PropTypes.string.isRequired,
};

export default SingleFacilityBody;
