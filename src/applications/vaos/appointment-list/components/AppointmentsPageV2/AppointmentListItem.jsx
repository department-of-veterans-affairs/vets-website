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
import { Link, useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const appointmentDate = moment.parseZone(appointment.start);
  const facilityId = getVARFacilityId(appointment);
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isVideo = appointment.vaos.isVideo;
  const isPhone = isVAPhoneAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const link = isCommunityCare
    ? `cc/${appointment.id}`
    : `va/${appointment.id}`;

  return (
    <li
      data-request-id={appointment.id}
      className="vaos-appts__card vaos-appts__card--clickable"
    >
      <div
        className="vaos-appts__card--clickable-content vads-u-display--flex vads-u-align-items--center"
        onClick={() => {
          if (!window.getSelection().toString()) history.push(link);
        }}
      >
        <div className="vads-u-flex--1">
          {canceled && (
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
          {isCommunityCare && (
            <CommunityCareProvider appointment={appointment} />
          )}
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
        {/* visible to medium screen and larger */}
        <div className="vads-u-display--none medium-screen:vads-u-display--inline">
          <Link
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`}
            to={link}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </div>
        {/* visble to small screen breakpoint */}
        <div className="medium-screen:vads-u-display--none">
          <Link
            to={link}
            className="vaos-appts__card-link"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`}
          >
            <i
              aria-hidden="true"
              className="fas fa-chevron-right vads-u-margin-left--1"
            />
          </Link>
        </div>
      </div>
    </li>
  );
}
