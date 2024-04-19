import React from 'react';
import PropTypes from 'prop-types';
import AppointmentCardIcon from './AppointmentCardIcon';

export default function AppointmentCard({ children, appointment }) {
  // placeholder for feature flag
  const selectSchedulingCardIcon = true;

  return (
    <>
      {selectSchedulingCardIcon && (
        <div className="vaos-appts__appointment-details--container vads-u-margin-top--2 vads-u-border--2px vads-u-border-color--gray-lighter vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3">
          <AppointmentCardIcon appointment={appointment} />

          {children}
        </div>
      )}

      {!selectSchedulingCardIcon && children}
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
