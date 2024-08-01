import React from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import NewTabAnchor from './NewTabAnchor';

export default function VideoLink({ appointment }) {
  const { url } = appointment.videoData;
  const diff = moment().diff(moment(appointment.start), 'minutes');

  // Button is enabled 30 minutes prior to start time, until 4 hours after start time
  // NOTE: If the moment is earlier than the moment you are passing to moment.fn.diff,
  // the return value will be negative. So checking to see if the appointment start
  // time is before or after the current time.
  let disableVideoLink;
  if (diff > 0) {
    disableVideoLink = diff > 30;
  } else {
    disableVideoLink = diff < -240;
  }

  return (
    <div className="vaos-appts__video-visit">
      {disableVideoLink && (
        <>
          We'll add the link to join this appointment 30 minutes before your
          appointment time.
          <br />
          <br />
        </>
      )}

      {!disableVideoLink && (
        <>
          Join the video appointment using the link.
          <br />
          <br />
          <NewTabAnchor
            href={url}
            className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--3"
            aria-describedby={`description-join-link-${appointment.id}`}
            onClick={e => e.preventDefault()}
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
      url: PropTypes.string.isRequired,
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
