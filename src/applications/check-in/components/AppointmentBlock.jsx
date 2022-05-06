import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AppointmentBlock = props => {
  const { appointments } = props;
  const { t } = useTranslation();

  const appointmentsDateTime = new Date(appointments[0].startTime);
  const appointmentFacility = appointments[0].facility;

  return (
    <div>
      <p
        className="vads-u-font-family--serif"
        data-testid="appointment-day-location"
      >
        {t('your-appointments-on-day-facility', {
          count: appointments.length,
          day: appointmentsDateTime,
          facility: appointmentFacility,
        })}
      </p>
      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 pre-check-in--appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map((appointment, index) => {
          const appointmentDateTime = new Date(appointment.startTime);
          const clinic = appointment.clinicFriendlyName
            ? appointment.clinicFriendlyName
            : appointment.clinicName;
          return (
            <li
              key={index}
              className="vads-u-border-bottom--1px pre-check-in--appointment-item"
              data-testid={`appointment-list-item-${index}`}
            >
              <dl className="pre-check-in--appointment-summary">
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  {t('time')}:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-time"
                >
                  {t('date-time', { date: appointmentDateTime })}
                </dd>
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  {t('clinic')}:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-clinic"
                >
                  {clinic}
                </dd>
              </dl>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

AppointmentBlock.propTypes = {
  appointments: PropTypes.array.isRequired,
};

export default AppointmentBlock;
