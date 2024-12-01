import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import NewTabAnchor from './NewTabAnchor';
import { ClinicOrFacilityPhone } from './layout/DetailPageLayout';
import { selectConfirmedAppointmentData } from '../appointment-list/redux/selectors';

export default function VideoLink({ appointment }) {
  const { url } = appointment.videoData;
  const diff = moment().diff(moment(appointment.start), 'minutes');
  const { clinicPhone, clinicPhoneExtension, facilityPhone } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  // Button is enabled 30 minutes prior to start time, until 4 hours after start time
  // NOTE: If the moment is earlier than the moment you are passing to moment.fn.diff,
  // the return value will be negative. So checking to see if the appointment start
  // time is before or after the current time.
  const disableVideoLink = diff > 30 || diff < -240;

  return (
    <div className="vaos-appts__video-visit">
      {disableVideoLink && (
        <>
          We'll add the link to join this appointment 30 minutes before your
          appointment time.
        </>
      )}

      {!disableVideoLink &&
        !url && (
          <div className="vads-u-margin-y--1">
            <va-alert
              close-btn-aria-label="Close notification"
              status="error"
              visible
            >
              <h3 slot="headline">
                We're sorry, we couldn't load the link to join your appointment
              </h3>
              <p className="vads-u-margin-y--0">
                Please contact your facility for help joining this appointment.
              </p>
              <ClinicOrFacilityPhone
                clinicPhone={clinicPhone}
                clinicPhoneExtension={clinicPhoneExtension}
                facilityPhone={facilityPhone}
              />
            </va-alert>
          </div>
        )}
      {!disableVideoLink &&
        !!url && (
          <>
            Join the video appointment using the link.
            <br />
            <NewTabAnchor
              href={url}
              className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-top--2"
              aria-describedby={`description-join-link-${appointment.id}`}
            >
              Join appointment
            </NewTabAnchor>
          </>
        )}
    </div>
  );
}

VideoLink.propTypes = {
  appointment: PropTypes.shape({
    start: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    videoData: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};
VideoLink.defaultProps = {
  appointment: {
    start: '',
    videoData: {
      url: '',
    },
  },
};
