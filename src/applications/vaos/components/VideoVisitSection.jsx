import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { VIDEO_TYPES } from '../utils/constants';

export default function VideoVisitSection({ appointment }) {
  let linkContent = <span>Video visit link unavailable</span>;

  if (appointment.vaos.isPastAppointment) {
    return <span>Video conference</span>;
  }

  if (appointment.vaos.videoType === VIDEO_TYPES.gfe) {
    linkContent = (
      <span>Join the video session from the device provided by the VA.</span>
    );
  } else if (
    appointment.contained?.[0]?.telecom?.find(tele => tele.system === 'url')
      ?.value
  ) {
    const url = appointment.contained?.[0]?.telecom?.[0]?.value;
    const diff = moment().diff(moment(appointment.start), 'minutes');

    // Button is enabled 30 minutes prior to start time, until 4 hours after start time
    const disableVideoLink = diff < -30 || diff > 240;
    const linkClasses = classNames(
      'usa-button',
      'vads-u-margin-left--0',
      'vads-u-margin-right--1p5',
      { 'usa-button-disabled': disableVideoLink },
    );

    linkContent = (
      <div className="vaos-appts__video-visit">
        <a
          aria-describedby={
            disableVideoLink
              ? `description-join-link-${appointment.id}`
              : undefined
          }
          aria-disabled={disableVideoLink ? 'true' : 'false'}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
          onClick={disableVideoLink ? e => e.preventDefault() : undefined}
        >
          Join session
        </a>
        {disableVideoLink && (
          <span
            id={`description-join-link-${appointment.id}`}
            className="vads-u-display--block vads-u-font-style--italic"
          >
            You can join VA Video Connect 30 minutes prior to the start time
          </span>
        )}
      </div>
    );
  }

  return (
    <dl className="vads-u-margin--0">
      <dt className="vads-u-font-weight--bold">
        How to join your virtual session
      </dt>
      <dd>{linkContent}</dd>
    </dl>
  );
}

VideoVisitSection.propTypes = {
  appointment: PropTypes.object.isRequired,
};
