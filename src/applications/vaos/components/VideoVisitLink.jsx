import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import {
  getVideoVisitLink,
  isGFEVideoVisit,
  getMomentConfirmedDate,
} from '../utils/appointment';

const VideoVisitLink = ({ appointment }) => {
  if (isGFEVideoVisit(appointment)) {
    return (
      <span>Join the video session from the device provided by the VA.</span>
    );
  }

  const videoLink = getVideoVisitLink(appointment);

  if (videoLink) {
    const apptTime = getMomentConfirmedDate(appointment);
    const diff = apptTime.diff(moment(), 'minutes');

    // Button is enabled 30 minutes prior to start time, until 4 hours after start time
    const disableVideoLink = diff < -30 || diff > 240;
    const linkClasses = classNames(
      'vaos-appts__video-link',
      'usa-button',
      'vads-u-margin--0',
      'vads-u-margin-right--1p5',
      { 'usa-button-disabled': disableVideoLink },
    );

    return (
      <div className="vaos-appts__video-visit vads-u-display--flex">
        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          Join
        </a>
        {disableVideoLink && (
          <span className="vads-u-display--block vads-u-font-style--italic">
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
