import React from 'react';
import AddToCalendar from '../../../components/AddToCalendar';
import { getCalendarData } from '../../../services/appointment';

export default function CalendarLink({ appointment, facility }) {
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
