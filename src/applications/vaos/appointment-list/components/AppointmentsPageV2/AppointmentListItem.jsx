import React from 'react';
import moment from '../../../lib/moment-tz';
import {
  getPractitionerDisplay,
  getVARFacilityId,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from '../../../utils/timezone';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../utils/constants';
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
  const isAtlas = appointment.videoData.isAtlas;
  const videoKind = appointment.videoData.kind;
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
      <i aria-hidden="true" className="fas fa-video vads-u-margin-right--1" />
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

export default function AppointmentListItem({ appointment, facility }) {
  const appointmentDate = moment.parseZone(appointment.start);
  const facilityId = getVARFacilityId(appointment);
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isVideo = appointment.vaos.isVideo;
  const isPhone = isVAPhoneAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vads-u-display--flex vads-u-align-items--center"
    >
      <div className="vads-u-flex--1">
        {appointment.status === APPOINTMENT_STATUS.cancelled && (
          <span className="vaos-u-text-transform--uppercase vads-u-font-size--base vads-u-font-weight--bold vads-u-color--secondary-dark vads-u-margin-x--0 vads-u-margin-y--0">
            Canceled
          </span>
        )}
        <h4 className="vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-top--0 vads-u-margin-bottom--0p25">
          {appointmentDate.format('dddd, MMMM D')}
        </h4>
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
        {isVideo && <VideoAppointmentDescription appointment={appointment} />}
        {isCommunityCare && <CommunityCareProvider appointment={appointment} />}
        {isInPersonVAAppointment && <VAFacilityName facility={facility} />}
        {isPhone && (
          <>
            <i
              aria-hidden="true"
              className="fas fa-phone vads-u-margin-right--1"
            />
            Phone call
          </>
        )}
      </div>
      <div>
        <Link
          aria-hidden="true"
          to={isCommunityCare ? `cc/${appointment.id}` : `va/${appointment.id}`}
          className="vads-u-display--none medium-screen:vads-u-display--inline"
        >
          Details
        </Link>
        <Link
          to={isCommunityCare ? `cc/${appointment.id}` : `va/${appointment.id}`}
          className="vaos-appts__card-link"
          aria-label={`Details for appointment on ${appointmentDate.format(
            'dddd, MMMM D h:mm a',
          )}`}
        >
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </Link>
      </div>
    </li>
  );
}
