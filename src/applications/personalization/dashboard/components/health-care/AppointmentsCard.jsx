import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';
import recordEvent from '~/platform/monitoring/record-event';
import { getAppointmentTimezone } from '../../utils/date-formatting/timezone';

export const AppointmentsCard = ({ appointments }) => {
  const nextAppointment = appointments?.[0];
  const localStartTime = nextAppointment?.localStartTime;
  let locationName;

  const timeZone = getAppointmentTimezone(nextAppointment);
  const timeZoneId = timeZone.description;

  if (nextAppointment?.isVideo) {
    locationName = 'VA Video Connect';

    if (nextAppointment?.additionalInfo) {
      locationName += ` ${nextAppointment.additionalInfo}`;
    }
  }

  if (!nextAppointment?.isVideo) {
    locationName = nextAppointment?.providerName;
  }

  const content = (
    <>
      <h3 className="vads-u-margin-top--0">Upcoming appointment</h3>
      <p className="vads-u-margin-bottom--1 dd-privacy-mask">
        {formatInTimeZone(localStartTime, timeZoneId, 'eeee, MMMM d, yyyy')}
      </p>
      <p className="vads-u-margin-bottom--1 vads-u-margin-top--1 dd-privacy-mask">
        {`Time: ${formatInTimeZone(localStartTime, timeZoneId, 'h:mm aaaa')} ${
          timeZone.abbreviation
        }`}
      </p>
      {locationName && (
        <p className="vads-u-margin-top--1 dd-privacy-mask">{locationName}</p>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Manage this appointment"
          href="/my-health/appointments"
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
        <div
          className="vads-u-display--flex vads-u-flex-direction--column desktop-lg:vads-u-flex--1 vads-u-padding--1"
          data-testid="health-care-appointments-card"
        >
          {content}
        </div>
      </va-card>
    </div>
  );
};

AppointmentsCard.propTypes = {
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
      location: PropTypes.object,
    }),
  ),
  hasError: PropTypes.bool,
};

export default AppointmentsCard;
