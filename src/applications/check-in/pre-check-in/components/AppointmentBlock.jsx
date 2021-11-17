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
      <p>
        Your {appointmentString} on {appointmentsDay} at {appointmentFacility}.
      </p>
      <ul>
        {appointments.map((appointment, index) => {
          const appointmentDateTime = new Date(appointments[0].startTime);
          return (
            <li key={index}>
              <dl>
                <dt>Time: </dt>
                <dd>{format(appointmentDateTime, 'h:mm aaaa')}</dd>
                <dt>Clinic: </dt>
                <dd>{appointment.clinicFriendlyName}</dd>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

AppointmentBlock.propTypes = {
  appointments: PropTypes.array.isRequired,
};

export default AppointmentBlock;
