import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { getTimezoneByFacilityId } from '../../../utils/timezone';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function VideoLink({ appointment }) {
  const { url } = appointment.videoData;
  const timezone = getTimezoneByFacilityId(
    appointment.location?.vistaId || appointment.location?.stationId,
  );
  const diff = moment()
    .tz(timezone)
    .diff(moment(appointment.start), 'minutes');

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
          Internet connection.
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
VideoLink.propTypes = {
  appointment: PropTypes.shape({
    start: PropTypes.string.isRequired,
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
