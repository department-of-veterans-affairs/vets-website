import React from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import { createAppointmentData } from '../utils/appointments';
import { setFlowType } from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS, VASS_PHONE_NUMBER } from '../utils/constants';

// TODO: replace with actual data
const appointmentData = createAppointmentData({
  startUTC: '2025-05-01T16:00:00.000Z',
  endUTC: '2025-05-01T16:30:00.000Z',
  topics: [{ topicName: 'Benefits' }, { topicName: 'Health care' }],
});

const AlreadyScheduled = () => {
  const appointmentDate = new Date(appointmentData.startUTC);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancelAppointment = e => {
    e.preventDefault();
    dispatch(setFlowType(FLOW_TYPES.CANCEL));
    navigate(`${URLS.CANCEL_APPOINTMENT}/${appointmentData.appointmentId}`);
  };
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
        onClick={handleCancelAppointment}
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
