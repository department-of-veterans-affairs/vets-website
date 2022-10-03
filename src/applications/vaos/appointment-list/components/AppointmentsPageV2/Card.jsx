import React from 'react';
import PropTypes from 'prop-types';
import moment from '../../../lib/moment-tz';
import {
  getAppointmentTimezone,
  isVAPhoneAppointment,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../utils/constants';

function VideoAppointmentDescription({ appointment }) {
  const { isAtlas } = appointment.videoData;
  const videoKind = appointment.videoData.kind;
  let desc = 'at home';
  if (isAtlas) {
    desc = 'at an ATLAS location';
  } else if (isClinicVideoAppointment(appointment)) {
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
VideoAppointmentDescription.propTypes = {
  appointment: PropTypes.object.isRequired,
};

function CommunityCareProvider({ appointment }) {
  const {
    providerName,
    practiceName,
    name,
  } = appointment.communityCareProvider;
  if (appointment.version === 1 && providerName !== undefined) {
    return <>{providerName || practiceName || 'Community care'}</>;
  }
  if (!!providerName || !!practiceName || !!name) {
    return <>{providerName[0] || practiceName || 'Community care'}</>;
  }
  return 'Community care';
}

CommunityCareProvider.propTypes = {
  appointment: PropTypes.object.isRequired,
};

function VAFacilityName({ facility }) {
  if (facility) {
    return <>{facility.name}</>;
  }

  return 'VA appointment';
}

VAFacilityName.propTypes = {
  facility: PropTypes.object,
};

export default function Card({
  appointment,
  facility,
  handleClick,
  handleKeyDown,
}) {
  const appointmentDate = moment.parseZone(appointment.start);
  const { isCommunityCare, isVideo } = appointment.vaos;
  const isPhone = isVAPhoneAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { abbreviation, description } = getAppointmentTimezone(appointment);

  return (
    <>
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="vads-u-padding--2 vads-u-display--flex vads-u-align-items--left vads-u-flex-direction--column medium-screen:vads-u-padding--3 medium-screen:vads-u-flex-direction--row medium-screen:vads-u-align-items--center"
        onClick={handleClick()}
        onKeyDown={handleKeyDown()}
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
          <span aria-hidden="true">{abbreviation}</span>
          <span className="sr-only"> {description}</span>
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
      </div>
    </>
  );
}

Card.propTypes = {
  appointment: PropTypes.object,
  facility: PropTypes.object,
  handleClick: PropTypes.func,
  handleKeyDown: PropTypes.func,
  idClickable: PropTypes.string,
};
