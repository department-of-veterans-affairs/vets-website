import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const AppointmentBlock = props => {
  const { appointments } = props;

  const appointmentString =
    appointments.length > 1 ? 'appointments' : 'appointment is';
  const appointmentsDateTime = new Date(appointments[0].startTime);
  const appointmentsDay = format(appointmentsDateTime, 'MMMM dd, Y');
  const appointmentFacility = appointments[0].facility;

  return (
    <div>
      <p
        className="vads-u-font-family--serif"
        data-testid="appointment-day-location"
      >
        Your {appointmentString} on {appointmentsDay} at {appointmentFacility}.
      </p>
      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 pre-check-in--appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map((appointment, index) => {
          const appointmentDateTime = new Date(appointment.startTime);
          return (
            <li
              key={index}
              className="vads-u-border-bottom--1px pre-check-in--appointment-item"
              data-testid={`appointment-list-item-${index}`}
            >
              <dl className="pre-check-in--appointment-summary">
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  Time:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-time"
                >
                  {format(appointmentDateTime, 'h:mm aaaa')}
                </dd>
                <dt className="pre-check-in--label vads-u-margin-right--1">
                  Clinic:
                </dt>
                <dd
                  className="pre-check-in--value"
                  data-testid="appointment-clinic"
                >
                  {appointment.clinicFriendlyName}
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
