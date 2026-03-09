import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';
import recordEvent from '~/platform/monitoring/record-event';
import { getAppointmentTimezone } from '../../utils/date-formatting/timezone';

export const AppointmentCard = ({ appointment }) => {
  const { localStartTime } = appointment;
  let locationName;

  const timeZone = getAppointmentTimezone(appointment);
  const timeZoneId = timeZone.description;

  if (appointment.isVideo) {
    locationName = 'VA Video Connect';

    if (appointment.additionalInfo) {
      locationName += ` ${appointment.additionalInfo}`;
    }
  }

  if (!appointment.isVideo) {
    locationName = appointment.providerName;
  }

  const content = (
    <>
      <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
        Upcoming appointment
      </h4>
      <p className="vads-u-margin-top--0p5 dd-privacy-mask">
        {formatInTimeZone(localStartTime, timeZoneId, 'eeee, MMMM d, yyyy')}
      </p>
      <p className="vads-u-margin-bottom--0 dd-privacy-mask">
        {`Time: ${formatInTimeZone(localStartTime, timeZoneId, 'h:mm aaaa')} ${
          timeZone.abbreviation
        }`}
      </p>
      {locationName && (
        <p className="vads-u-margin-bottom--0 dd-privacy-mask">
          {locationName}
        </p>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Manage this appointment"
          href={`/my-health/appointments/${appointment.id}`}
          onClick={() =>
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Schedule and manage your appointments',
              'links-list-section-header': 'Health care',
            })
          }
        />
      </p>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-card>
        <div data-testid="health-care-appointments-card">{content}</div>
      </va-card>
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.shape({
    additionalInfo: PropTypes.string,
    facility: PropTypes.object,
    id: PropTypes.string.isRequired,
    isVideo: PropTypes.bool.isRequired,
    localStartTime: PropTypes.string.isRequired,
    providerName: PropTypes.string,
    startsAt: PropTypes.string,
    timeZone: PropTypes.string,
    type: PropTypes.string.isRequired,
    location: PropTypes.object,
  }).isRequired,
};

export default AppointmentCard;
