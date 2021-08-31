import React from 'react';
import AddToCalendar from '../../../components/AddToCalendar';
import { getCalendarData } from '../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function CalendarLink({ appointment, facility }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const hideCanceledOrPast = canceled || isPastAppointment;

  if (hideCanceledOrPast) {
    return null;
  }

  const {
    text,
    providerName,
    phone,
    additionalText,
    location,
    summary,
  } = getCalendarData({
    appointment,
    facility,
  });

  return (
    <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
      <i
        aria-hidden="true"
        className="far fa-calendar vads-u-margin-right--1 vads-u-color--link-default"
      />
      <AddToCalendar
        summary={summary}
        description={{
          text,
          providerName,
          phone,
          additionalText,
        }}
        location={location}
        duration={appointment.minutesDuration}
        startDateTime={appointment.start}
      />
    </div>
  );
}
