import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function VideoLink({ appointment }) {
  const url = appointment.videoData.url;
  const diff = moment().diff(moment(appointment.start), 'minutes');

  // Button is enabled 30 minutes prior to start time, until 4 hours after start time
  const disableVideoLink = diff < -30 || diff > 240;
  const linkClasses = classNames(
    'usa-button',
    'vads-u-margin-left--0',
    'vads-u-margin-right--1p5',
    { 'usa-button-disabled': disableVideoLink },
    'vaos-link-for-print',
  );

  return (
    <div className="vaos-appts__video-visit">
      {disableVideoLink && (
        <span
          id={`description-join-link-${appointment.id}`}
          className="vads-u-display--block"
        >
          You can join this meeting from your home or anywhere you have a secure
          Internet connnection.
          <br />
          You can join VA Video Connect up to 30 minutes prior to the start
          time.
        </span>
      )}
      <NewTabAnchor
        href={url}
        aria-describedby={
          disableVideoLink
            ? `description-join-link-${appointment.id}`
            : undefined
        }
        aria-disabled={disableVideoLink ? 'true' : 'false'}
        className={linkClasses}
        onClick={disableVideoLink ? e => e.preventDefault() : undefined}
      >
        Join appointment
      </NewTabAnchor>
    </div>
  );
}
