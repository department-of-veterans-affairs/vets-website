import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import { setFlowType } from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS, VASS_PHONE_NUMBER } from '../utils/constants';
import { useGetAppointmentQuery } from '../redux/api/vassApi';
import { getBrowserTimezone } from '../utils/timezone';

const AlreadyScheduled = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: appointmentData, isLoading } = useGetAppointmentQuery({
    appointmentId,
  });

  const [appointmentDate, appointmentTime] = useMemo(
    () => {
      if (!appointmentData?.startUTC) {
        return ['', ''];
      }
      const date = new Date(appointmentData.startUTC);
      const timezone = getBrowserTimezone();
      return [
        formatInTimeZone(date, timezone, 'MM/dd/yyyy'),
        formatInTimeZone(date, timezone, 'hh:mm a'),
      ];
    },
    [appointmentData?.startUTC],
  );

  const handleCancelAppointment = e => {
    e.preventDefault();
    dispatch(setFlowType(FLOW_TYPES.CANCEL));
    navigate(`${URLS.CANCEL_APPOINTMENT}/${appointmentData.appointmentId}`);
  };

  return (
    <Wrapper
      testID="already-scheduled-page"
      pageTitle="You already scheduled your appointment with VA Solid Start"
      loading={isLoading}
      loadingMessage="Loading appointment details. This may take up to 30 seconds. Please don’t refresh the page."
    >
      <p id="appointment-date-time" data-testid="already-scheduled-date-time">
        Your VA Solid Start appointment is scheduled for {appointmentDate} at{' '}
        {appointmentTime}.
      </p>
      <p data-testid="already-scheduled-phone-number">
        Your VA Solid Start representative will call you at the time you
        requested from <va-telephone contact={VASS_PHONE_NUMBER} />. Save this
        number to ensure you don’t miss the appointment.
      </p>
      <va-link-action
        href={`/cancel-appointment/${appointmentData?.appointmentId}`}
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
