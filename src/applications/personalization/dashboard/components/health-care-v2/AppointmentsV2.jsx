import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import CTALink from '../CTALink';
import { getAppointmentTimezone } from '../../utils/timezone';

export const AppointmentsCard = ({ appointments }) => {
  const nextAppointment = appointments?.[0];
  const start = moment.parseZone(nextAppointment?.startsAt);
  let locationName;

  const timeZone = getAppointmentTimezone(nextAppointment);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  if (nextAppointment?.isVideo) {
    locationName = 'VA Video Connect';

    if (nextAppointment?.additionalInfo) {
      locationName += ` ${nextAppointment.additionalInfo}`;
    }
  }

  if (!nextAppointment?.isVideo) {
    locationName = nextAppointment?.providerName;
  }

  // appt link will be /my-health/appointments if toggle is on
  const apptLink = useToggleValue(
    TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
  )
    ? '/my-health/appointments'
    : '/health-care/schedule-view-va-appointments/appointments';

  return (
    <div
      className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5"
      data-testid="health-care-appointments-card-v2"
    >
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5">
        <h3 className="vads-u-margin-top--0">Next appointment</h3>
        <p className="vads-u-margin-bottom--1">
          {start.format('dddd, MMMM Do, YYYY')}
        </p>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
          {`Time: ${start.format('h:mm a')} ${timeZone.abbreviation}`}
        </p>
        {locationName && <p className="vads-u-margin-top--1">{locationName}</p>}
        <CTALink
          text="Schedule and manage your appointments"
          href={apptLink}
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
      </div>
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
