import React from 'react';
import moment from '../../../lib/moment-tz';
import {
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
import { focusElement } from 'platform/utilities/ui';

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
  return (
    <>
      {appointment.communityCareProvider.providerName ||
        appointment.communityCareProvider.practiceName ||
        'Community care'}
    </>
  );
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
  const idClickable = `id-${appointment.id}`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      className="vaos-appts__card vaos-appts__card--clickable"
      data-cy="appointment-list-item"
    >
      <div
        className="vads-u-padding--2 vads-u-display--flex vads-u-align-items--left vads-u-flex-direction--column medium-screen:vads-u-padding--3 medium-screen:vads-u-flex-direction--row medium-screen:vads-u-align-items--center"
        onClick={() =>
          !window.getSelection().toString()
            ? (focusElement(`#${idClickable}`), history.push(link))
            : null
        }
      >
        <div className="vads-u-flex--1 vads-u-margin-y--neg0p5">
          {canceled && (
            <div className="vads-u-margin-bottom--1">
              <span className="usa-label">Canceled</span>
            </div>
          )}
          <h4 className="vads-u-margin-y--0 vads-u-margin-bottom--0p25">
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
        <div className="vads-u-flex--auto vads-u-padding-top--0p5 medium-screen:vads-u-padding-top--0">
          <Link
            className="vaos-appts__focus--hide-outline"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`}
            to={link}
            onClick={e => e.preventDefault()}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-margin-left--1"
          />
        </div>
      </div>
    </li>
  );
}
