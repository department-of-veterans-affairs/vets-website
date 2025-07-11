import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';
import recordEvent from '~/platform/monitoring/record-event';
import { getAppointmentTimezone } from '../../utils/date-formatting/timezone';

export const AppointmentsCard2 = ({ appointments }) => {
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

  return (
    <va-card data-testid="health-care-appointments-card">
      <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
        Upcoming appointment
      </h4>
      <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--2">
        {formatInTimeZone(localStartTime, timeZoneId, 'eeee, MMMM d, yyyy')}
      </p>
      <p className="vads-u-margin-top--2 vads-u-margin-bottom--0p5">
        {`Time: ${formatInTimeZone(localStartTime, timeZoneId, 'h:mm aaaa')} ${
          timeZone.abbreviation
        }`}
      </p>
      {locationName && (
        <p className="vads-u-margin-top--2 vads-u-margin-bottom--0p5">
          {locationName}
        </p>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Manage health appointments"
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
    </va-card>
  );
};

AppointmentsCard2.propTypes = {
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

export default AppointmentsCard2;
