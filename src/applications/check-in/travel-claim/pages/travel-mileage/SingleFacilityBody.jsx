import React from 'react';
import PropTypes from 'prop-types';

const SingleFacilityBody = ({ facility, appointments, formatAppointment }) => (
  <div
    className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding-y--1 vads-u-margin-y--2 vads-u-border-color--gray-light"
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

SingleFacilityBody.propTypes = {
  appointments: PropTypes.array.isRequired,
  facility: PropTypes.string.isRequired,
  formatAppointment: PropTypes.func.isRequired,
};

export default SingleFacilityBody;
