import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';

export const Appointments = ({ appointments }) => {
  const nextAppointment = appointments?.[0];
  const start = new Date(nextAppointment?.startsAt);
  let locationName;

  if (nextAppointment?.isVideo) {
    locationName = 'VA Video Connect';

    if (nextAppointment?.additionalInfo) {
      locationName += ` ${nextAppointment.additionalInfo}`;
    }
  }

  if (!nextAppointment?.isVideo) {
    locationName = nextAppointment?.providerName;
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 large-screen:vads-u-margin-right--3 small-screen:vads-u-margin-bottom--2">
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5">
        <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
          Next appointment
        </h4>
        <p className="vads-u-margin-bottom--1">
          {format(start, 'EEEE, MMMM Mo, yyyy')}
        </p>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
          {`Time: ${format(start, 'h:mm aaaa')} ${nextAppointment?.timeZone}`}
        </p>
        <p className="vads-u-margin-top--1">{locationName}</p>
        <CTALink
          text="Schedule and view your appointments"
          icon="calendar"
          href="/health-care/schedule-view-va-appointments/appointments"
        />
      </div>
    </div>
  );
};

Appointments.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      additionalInfo: PropTypes.string,
      facility: PropTypes.object,
      id: PropTypes.string.isRequired,
      isVideo: PropTypes.bool.isRequired,
      providerName: PropTypes.string,
      startsAt: PropTypes.string.isRequired,
      timeZone: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  ),
};

export default Appointments;
