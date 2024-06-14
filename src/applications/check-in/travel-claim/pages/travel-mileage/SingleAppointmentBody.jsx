import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SingleAppointmentBody = ({ appointment }) => {
  const { t } = useTranslation();
  const formatAppointment = () => {
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
      data-testid="single-appointment-context"
    >
      <span className="vads-u-font-weight--bold">{appointment.facility}</span>
      <div className="vads-u-margin-y--1">
        <p
          className="vads-u-margin--0"
          key={appointment.appointmentIen}
          data-testid={`appointment-list-item-${appointment.appointmentIen}`}
        >
          {formatAppointment()}
        </p>
      </div>
    </div>
  );
};

SingleAppointmentBody.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default SingleAppointmentBody;
