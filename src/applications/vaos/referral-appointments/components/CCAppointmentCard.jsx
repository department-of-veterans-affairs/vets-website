import React from 'react';
import PropTypes from 'prop-types';
import { appointmentIcon } from '../../utils/appointmentCardIcon';

const ccAppointmentStub = {
  vaos: {
    isCommunityCare: true,
  },
};
export default function CCAppointmentCard({ children }) {
  return (
    <va-card
      data-testid="cc-appointment-card"
      className="vaos-appts__appointment-details--container vads-u-margin-top--2 vads-u-border--2px vads-u-border-color--gray-lighter vads-u-padding-x--2 vads-u-padding-top--0p5 vads-u-padding-bottom--3"
      icon-name={appointmentIcon(ccAppointmentStub)}
    >
      <h3 data-testid="cc-appointment-card-header">
        Comunity care appointment
      </h3>
      {children}
    </va-card>
  );
}

CCAppointmentCard.propTypes = {
  children: PropTypes.node,
};
