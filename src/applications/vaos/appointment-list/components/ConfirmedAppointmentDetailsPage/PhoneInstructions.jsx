import React from 'react';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function PhoneInstructions({ appointment }) {
  const isPhone = appointment.vaos.isPhoneAppointment;
  const isCanceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  if (!isPhone || isCanceled) {
    return null;
  }

  return (
    <div className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
      Someone from your VA facility will call you at your phone number on file
      at the appointment time.
    </div>
  );
}
