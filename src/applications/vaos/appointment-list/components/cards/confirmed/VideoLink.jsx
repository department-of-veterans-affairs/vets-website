import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import {
  isVideoGFE,
  isAtlasLocation,
  isVideoVAFacility,
  isVideoHome,
} from '../../../../services/appointment';
import NewTabAnchor from '../../../../components/NewTabAnchor';

export default function VideoLink({ appointment }) {
  if (isVideoGFE(appointment)) {
    return (
      <span>
        You can join this video meeting using a device provided by VA.
      </span>
    );
  } else if (isVideoVAFacility(appointment)) {
    return (
      <span>
        You must join this video meeting from the VA location listed below.
      </span>
    );
  } else if (isAtlasLocation(appointment)) {
    return (
      <span>
        You must join this video meeting from the ATLAS (non-VA) location listed
        below.
      </span>
    );
  } else if (isVideoHome(appointment)) {
    const url = appointment.contained?.find(
      res => res.resourceType === 'HealthcareService',
    )?.telecom?.[0]?.value;
    const diff = moment().diff(moment(appointment.start), 'minutes');

    // Button is enabled 30 minutes prior to start time, until 4 hours after start time
    const disableVideoLink = diff < -30 || diff > 240;
    const linkClasses = classNames(
      'usa-button',
      'vads-u-margin-left--0',
      'vads-u-margin-right--1p5',
      { 'usa-button-disabled': disableVideoLink },
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
            time
          </span>
        )}
        <NewTabAnchor
          href={url}
          className={linkClasses}
          aria-describedby={
            disableVideoLink
              ? `description-join-link-${appointment.id}`
              : undefined
          }
          aria-disabled={disableVideoLink ? 'true' : 'false'}
          onClick={disableVideoLink ? e => e.preventDefault() : undefined}
        >
          Join appointment
        </NewTabAnchor>
      </div>
    );
  }

  return <span>Video visit link unavailable</span>;
}
