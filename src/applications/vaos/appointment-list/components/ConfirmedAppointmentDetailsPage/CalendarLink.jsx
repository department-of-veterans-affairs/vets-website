import React from 'react';
import PropTypes from 'prop-types';
import AddToCalendar from '../../../components/AddToCalendar';
import { getCalendarData } from '../../../services/appointment';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function CalendarLink({ appointment, facility }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;
  const isCC = appointment.vaos.isCommunityCare;
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

  const description = {
    text,
    phone,
    additionalText,
    ...(!isCC && { providerName }),
  };

  return (
    <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
      <AddToCalendar
        summary={summary}
        description={description}
        location={location}
        duration={appointment.minutesDuration}
        startDateTime={appointment.start}
      />
    </div>
  );
}

CalendarLink.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
