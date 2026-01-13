import React from 'react';
import { format } from 'date-fns';

import Wrapper from '../layout/Wrapper';
import { useGetUserAppointmentQuery } from '../redux/api/vassApi';

const AlreadyScheduled = () => {
  const {
    data: appointmentResponse,
    isLoading,
    isError,
  } = useGetUserAppointmentQuery();

  if (isLoading) {
    return (
      <Wrapper
        testID="already-scheduled-page"
        pageTitle="You already scheduled your appointment with VA Solid Start"
      >
        <va-loading-indicator
          message="Loading your appointment..."
          data-testid="loading-indicator"
        />
      </Wrapper>
    );
  }

  if (isError || !appointmentResponse?.data) {
    return (
      <Wrapper
        testID="already-scheduled-page"
        pageTitle="You already scheduled your appointment with VA Solid Start"
      >
        <va-alert status="error" data-testid="error-alert">
          <p className="vads-u-margin-y--0">
            We’re sorry. We can’t access your appointment information right now.
            Please try again later or call us at{' '}
            <va-telephone contact="8008270611" />.
          </p>
        </va-alert>
      </Wrapper>
    );
  }

  const appointmentData = appointmentResponse.data;
  const appointmentDate = new Date(appointmentData.dtStartUtc);
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
        requested from <va-telephone contact="8008270611" />. Save this number
        to ensure you don’t miss the appointment.
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
        <va-telephone contact="8008270611" />. We’re here Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET.
      </p>
    </Wrapper>
  );
};

export default AlreadyScheduled;
