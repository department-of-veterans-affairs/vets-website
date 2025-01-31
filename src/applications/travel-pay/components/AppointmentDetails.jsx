import React from 'react';
import PropTypes from 'prop-types';

import { formatDateTime, getDaysLeft } from '../util/dates';

const AppointmentDetails = ({ appointment }) => {
  const [formattedDate] = formatDateTime(appointment.localStartTime);
  const daysLeft = getDaysLeft(appointment.localStartTime);

  return (
    <>
      <p>
        You have{' '}
        <strong>{`${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}</strong> left
        to file for your appointment on{' '}
        <strong>
          {formattedDate} at {appointment.location.attributes.name}
        </strong>
        .
      </p>
    </>
  );
};

AppointmentDetails.prototypes = {
  appointment: PropTypes.object.isRequired,
};

export default AppointmentDetails;
