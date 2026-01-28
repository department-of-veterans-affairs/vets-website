import React from 'react';
import { format } from 'date-fns';

import Wrapper from '../layout/Wrapper';
import { VASS_PHONE_NUMBER } from '../utils/constants';
import { createAppointmentData } from '../utils/appointments';

// TODO: replace with actual data
const appointmentData = createAppointmentData({
  startUTC: '2025-05-01T16:00:00.000Z',
  endUTC: '2025-05-01T16:30:00.000Z',
  topics: [{ topicName: 'Benefits' }, { topicName: 'Health care' }],
});

const AlreadyScheduled = () => {
  const appointmentDate = new Date(appointmentData.startUTC);
  return (
    <Wrapper
      testID="already-scheduled-page"
      pageTitle="You already scheduled your appointment with VA Solid Start"
    >
      <p id="appointment-date-time" data-testid="already-scheduled-date-time">
        Your VA Solid Start appointment is scheduled for{' '}
        {format(appointmentDate, 'MM/dd/yyyy')} at{' '}
        {format(appointmentDate, 'hh:mm a')}.
      </p>
      <p data-testid="already-scheduled-phone-number">
        Your VA Solid Start representative will call you at the time you
        requested from <va-telephone contact={VASS_PHONE_NUMBER} />. Save this
        number to ensure you don’t miss the appointment.
      </p>
      <va-link-action
        href={`/cancel-appointment/${appointmentData.appointmentId}`}
        text="Cancel this appointment"
        aria-labelledby="appointment-date-time"
        type="secondary"
        data-testid="already-scheduled-cancel-button"
      />
      <p data-testid="already-scheduled-reschedule-message">
        If you want to reschedule this appointment, call us at{' '}
        <va-telephone contact={VASS_PHONE_NUMBER} />. We’re here Monday through
        Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </Wrapper>
  );
};

export default AlreadyScheduled;
