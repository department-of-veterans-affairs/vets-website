import React from 'react';
import moment from 'moment';
import {
  getPractitionerDisplay,
  getVARFacilityId,
  getVideoKind,
  isAtlasLocation,
  isVideoAppointment,
} from '../../services/appointment';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from '../../utils/timezone';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../utils/constants';
import { Link } from 'react-router-dom';

function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone;
  return stripDST(tzAbbr);
}

function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

function VideoAppointmentDescription({ appointment }) {
  const isAtlas = isAtlasLocation(appointment);
  const videoKind = getVideoKind(appointment);
  let desc = 'at home';
  if (isAtlas) {
    desc = 'at an ATLAS location';
  } else if (videoKind === VIDEO_TYPES.clinic) {
    desc = 'at a VA location';
  } else if (videoKind === VIDEO_TYPES.gfe) {
    desc = 'using a VA device';
  }
  return (
    <>
      <i className="fas fa-video vads-u-margin-right--1" />
      VA Video Connect {desc}
    </>
  );
}

function CommunityCareProvider({ appointment }) {
  const practitioner = getPractitionerDisplay(appointment.participant);
  if (practitioner) {
    return <>{practitioner}</>;
  }

  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  return <>{location?.name || 'Community care'}</>;
}

function VAFacilityName({ facility }) {
  if (facility) {
    return <>{facility.name}</>;
  }

  return 'VA appointment';
}

export default function AppointmentListItem({ appointment, facility, index }) {
  const appointmentDate = moment.parseZone(appointment.start);
  const facilityId = getVARFacilityId(appointment);
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isVideo = isVideoAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare;

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      data-request-id={appointment.id}
      className="vads-u-position--relative vads-u-padding--2 vads-u-background-color--gray-light-alt vads-u-display--flex vads-u-margin-bottom--2 vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        {cancelled && (
          <span className="vads-u-color--secondary-dark">Cancelled</span>
        )}
        <h3 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-y--0">
          {appointmentDate.format('dddd, MMMM D')}
        </h3>
        {appointmentDate.format('h:mm a')}{' '}
        <span aria-hidden="true">
          {getAppointmentTimezoneAbbreviation(
            appointment.vaos.timeZone,
            facilityId,
          )}
        </span>
        <span className="sr-only">
          {' '}
          {getAppointmentTimezoneDescription(
            appointment.vaos.timeZone,
            facilityId,
          )}
        </span>
        <br />
        <div className="vads-u-position--relative">
          {isVideo && <VideoAppointmentDescription appointment={appointment} />}
          {isCommunityCare && (
            <CommunityCareProvider appointment={appointment} />
          )}
          {isInPersonVAAppointment && <VAFacilityName facility={facility} />}
        </div>
      </div>
      <div>
        <Link to={`va/${appointment.id}`} className="vaos__card-link">
          <i className="fas fa-chevron-right" />
        </Link>
      </div>
    </li>
  );
}
