import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { isVideoGFE, isAtlasLocation } from '../../../../services/appointment';
import FacilityAddress from '../../../../components/FacilityAddress';

function JoinVideoInstructions({ appointment }) {
  if (isAtlasLocation(appointment)) {
    const vvsAppointment = appointment.legacyVAR.apiData.vvsAppointments[0];
    const name = `ATLAS facility in ${vvsAppointment.tasInfo.address.city}, ${
      vvsAppointment.tasInfo.address.state
    }`;
    const facility = {
      name,
      address: {
        ...vvsAppointment.tasInfo.address,
        line: [vvsAppointment.tasInfo.address.streetAddress],
        postalCode: vvsAppointment.tasInfo.address.zipCode,
      },
    };

    return (
      <span
        id={`description-join-link-${appointment.id}`}
        className="vads-u-display--block"
      >
        You must join this video meeting from the ATLAS (non-VA) location listed
        below.
        <br />
        <br />
        <FacilityAddress facility={facility} showDirectionsLink />
      </span>
    );
  } else {
    return null;
  }
}

export default function VideoVisitSection({ appointment }) {
  const isAtlas = isAtlasLocation(appointment);
  const isGFE = isVideoGFE(appointment);

  let linkContent = <span>Video visit link unavailable</span>;

  if (appointment.vaos.isPastAppointment) {
    return <span>Video conference</span>;
  }

  if (isGFE) {
    linkContent = (
      <span>
        You can join this video meeting using a device provided by VA.
      </span>
    );
  } else if (isAtlas) {
    linkContent = <JoinVideoInstructions appointment={appointment} />;
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
        How to join your{' '}
        {isAtlas || isGFE ? 'video appointment' : 'virtual session'}
      </dt>
      <dd>
        {linkContent}
        {isAtlas && (
          <div>
            <p>
              <span className="vads-u-font-weight--bold">
                Appointment code:{' '}
                {
                  appointment.legacyVAR.apiData.vvsAppointments[0].tasInfo
                    .confirmationCode
                }
              </span>
              <br />
              <span>
                You will use this code to find your appointment using the
                computer provided at the site.
              </span>
            </p>
          </div>
        )}
      </dd>
    </dl>
  );
}

VideoVisitSection.propTypes = {
  appointment: PropTypes.object.isRequired,
};
