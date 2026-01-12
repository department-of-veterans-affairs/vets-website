import React from 'react';
import PropTypes from 'prop-types';

// const appointmentIcon = appointment => {
//   const {
//     isCommunityCare,
//     isCompAndPenAppointment,
//     isCOVIDVaccine,
//     isPendingAppointment,
//     isVAPhoneAppointment: isPhone,
//   } = appointment;

//   if (isPhone && !isPendingAppointment) {
//     return 'phone';
//   }

//   if (isCommunityCare) {
//     return 'calendar_today';
//   }

//   if (
//     (appointment.isInPersonVisi && !isPendingAppointment) ||
//     isCOVIDVaccine ||
//     isCompAndPenAppointment ||
//     appointment.isClinicVideoAppointment ||
//     appointment.isAtlasVideoAppointment
//   ) {
//     return 'location_city';
//   }

//   if (appointment.isVideoAtHome) {
//     return 'videocam';
//   }
//   return 'calendar_today';
// };

export default function AppointmentCard({ children, appointment }) {
  return (
    <>
      <va-card
        className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
        data-testid="appointment-card"
        icon-name={appointment.modalityIcon}
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
