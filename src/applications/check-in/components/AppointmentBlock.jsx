// This component should be deleted when the isPhoneAppointmentsEnabled flag is deprecated, since it is redundant with AppointmentBlockWithIcons.
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppointmentConfirmationListItem from './AppointmentDisplay/AppointmentConfirmationListItem';

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
        className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map((appointment, index) => {
          return (
            <AppointmentConfirmationListItem
              appointment={appointment}
              index={index}
              key={index}
            />
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
