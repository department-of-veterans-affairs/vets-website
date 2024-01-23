import React from 'react';
import PropTypes from 'prop-types';
import { format, utcToZonedTime } from 'date-fns-tz';
import recordEvent from '~/platform/monitoring/record-event';
import { Toggler } from '~/platform/utilities/feature-toggles';
import CTALink from '../CTALink';
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
      <h3 className="vads-u-margin-top--0">Next appointment</h3>
      <p className="vads-u-margin-bottom--1">
        {format(
          utcToZonedTime(localStartTime, timeZoneId),
          'eeee, MMMM d, yyyy',
        )}
      </p>
      <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
        {`Time: ${format(
          utcToZonedTime(localStartTime, timeZoneId),
          'h:mm aaaa',
        )} ${timeZone.abbreviation}`}
      </p>
      {locationName && <p className="vads-u-margin-top--1">{locationName}</p>}
      <CTALink
        text="Schedule and manage your appointments"
        href="/my-health/appointments"
        showArrow
        className="vads-u-font-weight--bold"
        onClick={() =>
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Schedule and manage your appointments',
            'links-list-section-header': 'Health care',
          })
        }
      />
    </>
  );

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaUseExperimentalFrontend}>
      <Toggler.Enabled>
        <div className="vads-u-margin-bottom--2p5">
          <va-card>
            <div
              className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-padding--1"
              data-testid="health-care-appointments-card"
            >
              {content}
            </div>
          </va-card>
        </div>
      </Toggler.Enabled>

      <Toggler.Disabled>
        <div
          className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5"
          data-testid="health-care-appointments-card"
        >
          <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5">
            {content}
          </div>
        </div>
      </Toggler.Disabled>
    </Toggler>
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
