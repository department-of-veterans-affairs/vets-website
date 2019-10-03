import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getVideoVisitLink } from '../utils/appointment';

const VideoVisitLink = ({ appointment }) => {
  const videoLink = getVideoVisitLink(appointment);
  let disableVideoLink = true;

  if (videoLink) {
    const now = moment();
    const apptTime = moment(appointment.startDate);
    const diff = apptTime.diff(now, 'minutes');
    disableVideoLink = diff < 0 || diff > 30;
  }

  return (
    <div className="vads-u-display--block">
      <a
        href={videoLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`vaos-appts__video-link usa-button ${
          disableVideoLink ? 'usa-button-disabled' : ''
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
};

VideoVisitLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default VideoVisitLink;
