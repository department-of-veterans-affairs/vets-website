import React from 'react';
import PropTypes from 'prop-types';
import FacilityPhone from '../../../components/FacilityPhone';
import InfoAlert from '../../../components/InfoAlert';
import { getFacilityPhone } from '../../../services/location';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function NoOnlineCancelAlert({ appointment, facility }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment, isCompAndPenAppointment } = appointment.vaos;

  if (canceled || isPastAppointment) {
    return null;
  }

  const name = facility?.name;
  const facilityPhone = getFacilityPhone(facility);

  return (
    <InfoAlert
      status="info"
      className="vads-u-display--block"
      headline="Need to make changes?"
      backgroundOnly
    >
      {!facility &&
        !isCompAndPenAppointment &&
        'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.'}
      {!!facility &&
        !isCompAndPenAppointment &&
        'Contact this facility if you need to reschedule or cancel your appointment.'}
      {!!facility &&
        isCompAndPenAppointment &&
        `Contact the ${name} compensation and pension office if you need to reschedule or cancel your appointment:`}
      <br />
      {facilityPhone &&
        isCompAndPenAppointment && (
          <>
            <br />
            <FacilityPhone contact={facilityPhone} level={3} />
          </>
        )}
      {!!facility &&
        !isCompAndPenAppointment && (
          <span className="vads-u-display--block vads-u-margin-top--2">
            {name}
            {facilityPhone && (
              <>
                <br />
                <FacilityPhone contact={facilityPhone} level={3} />
              </>
            )}
          </span>
        )}
    </InfoAlert>
  );
}

NoOnlineCancelAlert.propTypes = {
  appointment: PropTypes.shape({
    status: PropTypes.string.isRequired,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool,
      isCompAndPenAppointment: PropTypes.bool,
    }),
  }),

  facility: PropTypes.shape({
    name: PropTypes.string,
    telecom: PropTypes.array,
  }),
};

NoOnlineCancelAlert.defaultProps = {
  appointment: {
    status: 'booked',
    vaos: {
      isPastAppointment: false,
      isCompAndPenAppointment: false,
    },
  },

  facility: null,
};
