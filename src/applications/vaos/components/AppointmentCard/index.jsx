import React from 'react';
import PropTypes from 'prop-types';
import { appointmentIcon } from '../../utils/appointmentCardIcon';

export default function AppointmentCard({ children, appointment }) {
  return (
    <>
      <va-card
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="appointment-card"
        icon-name={appointmentIcon(appointment)}
      >
        {children}
      </va-card>
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  children: PropTypes.node,
};
