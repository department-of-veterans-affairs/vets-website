import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getVideoVisitLink, isGFEVideoVisit } from '../utils/appointment';

const VideoVisitLink = ({ appointment }) => {
  if (isGFEVideoVisit(appointment)) {
    return (
      <span>Join the video session from the device provided by the VA.</span>
    );
  }

  const videoLink = getVideoVisitLink(appointment);

  if (videoLink) {
    const now = moment();
    const apptTime = moment(appointment.startDate);
    const diff = apptTime.diff(now, 'minutes');
    let disableVideoLink = true;

    // Button is enabled 30 minutes prior to start time, until 4 hours after start time
    disableVideoLink = diff < -30 || diff > 240;

    return (
      <div className="vads-u-display--block">
        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`vaos-appts__video-link usa-button${
            disableVideoLink ? ' usa-button-disabled' : ''
          }`}
        >
          Join meeting
        </a>
        {disableVideoLink && (
          <span className="vads-u-display--block">
            You can join 30 minutes prior to your appointment
          </span>
        )}
      </div>
    );
  }

  return <span>Video visit link unavailable</span>;
};

VideoVisitLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default VideoVisitLink;
