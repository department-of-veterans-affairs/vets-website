import React from 'react';
import PropTypes from 'prop-types';
import AppointmentCardIcon from './AppointmentCardIcon';

export default function AppointmentCard({ children, appointment }) {
  return (
    <>
      <div
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="appointment-card"
      >
        <AppointmentCardIcon appointment={appointment} />
        {children}
      </div>
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  children: PropTypes.node,
};
