import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from '../../../lib/moment-tz';
import {
  getAppointmentTimezone,
  isClinicVideoAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import {
  APPOINTMENT_STATUS,
  VIDEO_TYPES,
  SPACE_BAR,
} from '../../../utils/constants';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';

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

function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

export default function AppointmentListItem({ appointment, facility }) {
  const history = useHistory();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const appointmentDate = moment.parseZone(appointment.start);
  const { isCommunityCare, isVideo, isPastAppointment } = appointment.vaos;
  const isPhone = isVAPhoneAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare && !isPhone;
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const link = isCommunityCare
    ? `${featureStatusImprovement && isPastAppointment ? '/past/' : ''}cc/${
        appointment.id
      }`
    : `${featureStatusImprovement && isPastAppointment ? '/past/' : ''}va/${
        appointment.id
      }`;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const { abbreviation, description } = getAppointmentTimezone(appointment);
  const label = `Details for ${
    canceled ? 'canceled ' : ''
  }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      className="vaos-appts__card--clickable vads-u-margin-bottom--3"
      data-cy="appointment-list-item"
    >
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="vads-u-padding--2 vads-u-display--flex vads-u-align-items--left vads-u-flex-direction--column medium-screen:vads-u-padding--3 medium-screen:vads-u-flex-direction--row medium-screen:vads-u-align-items--center"
        onClick={handleClick({
          history,
          link,
          idClickable,
        })}
        onKeyDown={handleKeyDown({
          history,
          link,
          idClickable,
        })}
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
        <div className="vads-u-flex--auto vads-u-padding-top--0p5 medium-screen:vads-u-padding-top--0 vaos-hide-for-print">
          <Link
            className="vaos-appts__focus--hide-outline"
            aria-label={label}
            to={link}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-color--link-default vads-u-margin-left--1"
          />
        </div>
      </div>
    </li>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
