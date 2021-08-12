import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import {
  isClinicVideoAppointment,
  isVideoHome,
} from '../../../services/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';
import { VIDEO_TYPES } from '../../../utils/constants';

export default function VideoLink({ appointment, hasFacility, isPast }) {
  if (isPast) {
    return <span>Video conference</span>;
  } else if (appointment.videoData.kind === VIDEO_TYPES.gfe) {
    return (
      <span>
        You can join this video meeting using a device provided by VA.
      </span>
    );
  } else if (isClinicVideoAppointment(appointment)) {
    return (
      <span>
        You must join this video meeting from the VA location{' '}
        {hasFacility ? 'listed below' : 'where the appointment was scheduled'}.
      </span>
    );
  } else if (appointment.videoData.isAtlas) {
    return (
      <span>
        You must join this video meeting from the ATLAS (non-VA) location listed
        below.
      </span>
    );
  } else if (isVideoHome(appointment)) {
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
            You can join this meeting from your home or anywhere you have a
            secure Internet connnection.
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

  return <span>Video visit link unavailable</span>;
}
