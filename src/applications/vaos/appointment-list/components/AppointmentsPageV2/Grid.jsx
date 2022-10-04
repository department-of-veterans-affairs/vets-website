import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  getAppointmentDate,
  getAppointmentTimezone,
  isClinicVideoAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../utils/constants';
import { getTypeOfCareById } from '../../../utils/appointment';
import { Label } from './Label';
// import { handleClick, handleKeyDown, Label } from './AppointmentListItem';

function isInPersonVAAppointment(appointment) {
  const { isCommunityCare, isVideo } = appointment?.vaos || {};
  const isPhone = isVAPhoneAppointment(appointment);

  return !isVideo && !isCommunityCare && !isPhone;
}

function getVideoAppointmentLocationText(appointment) {
  const { isAtlas } = appointment.videoData;
  const videoKind = appointment.videoData.kind;
  let desc = 'Video appointment at home';

  if (isAtlas) {
    desc = 'Video appointment at an ATLAS location';
  } else if (isClinicVideoAppointment(appointment)) {
    desc = 'Video appointment at a VA location';
  } else if (videoKind === VIDEO_TYPES.gfe) {
    desc = 'Video with VA device';
  }

  return desc;
}

function getPractitionerName(appointment) {
  const { practitioners } = appointment;

  if (!practitioners) return '<name here>';

  const practitioner = practitioners[0];
  const { name } = practitioner;

  return `${name.given.toString().replaceAll(',', ' ')} ${name.family}`;
}

function getGridData(appointment) {
  const { isCommunityCare, isVideo } = appointment?.vaos || {};
  const isPhone = isVAPhoneAppointment(appointment);
  const { serviceType } = appointment?.vaos.apiData || {};

  if (isCommunityCare) {
    return {
      appointmentDetails: 'Community care',
      appointmentType: 'Community care',
      icon: '',
    };
  }
  if (isVideo) {
    return {
      appointmentDetails: `VA Appointment with ${getPractitionerName(
        appointment,
      )}`,
      appointmentType: getVideoAppointmentLocationText(appointment),
      icon: '',
    };
  }
  if (isPhone) {
    return {
      appointmentDetails: 'VA Appointment',
      appointmentType: 'Phone call',
      icon: 'fas fa-phone vads-u-margin-right--1',
    };
  }
  if (isInPersonVAAppointment()) {
    const { name } = getTypeOfCareById(serviceType) || {};
    return {
      appointmentDetails: `${name} with ${getPractitionerName(appointment)}`,
      appointmentType: `In person at ${appointment.vaos.facilityData?.name}`,
      icon: '',
    };
  }
  return {
    appointmentDetails: '',
    appointmentType: '',
    icon: '',
  };
}

function isCanceled(appointment) {
  return appointment.status === APPOINTMENT_STATUS.cancelled;
}

function getLabelText(appointment) {
  const appointmentDate = getAppointmentDate(appointment);

  return `Details for ${
    isCanceled(appointment) ? 'canceled ' : ''
  }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`;
}

export default function Grid({
  appointment,
  link,
  handleClick,
  handleKeyDown,
}) {
  const { isCommunityCare, isVideo } = appointment.vaos;
  const canceled = isCanceled(appointment);
  const appointmentDate = getAppointmentDate(appointment);
  const { abbreviation, description } = getAppointmentTimezone(appointment);
  const label = getLabelText(canceled);
  const { appointmentDetails, appointmentType } = getGridData(appointment);
  const styles = {
    canceled: {
      textDecoration: canceled ? 'line-through' : 'none',
    },
  };

  return (
    <>
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={classNames(
          // 'vads-u-padding--2',
          'vads-u-display--flex',
          'vads-u-align-items--left',
          'vads-u-flex-direction--column',
          'medium-screen:vads-u-flex-direction--row',
          'medium-screen:vads-u-align-items--center',
        )}
        onClick={handleClick()}
        onKeyDown={handleKeyDown()}
      >
        <div className="vads-u-flex--auto vads-u-margin-y--neg0p5">
          <Label label="Canceled" />
          <div style={{ width: '33px' }}>
            <h4 className="vads-u-margin-y--0 vads-u-font-size--h3 vads-u-padding-right--1 vads-u-padding-y--2">
              {appointmentDate.format('D')}
            </h4>
            <span className="sr-only"> {description}</span>
          </div>
        </div>
        <div className="vads-u-flex--auto vads-u-padding-y--2">
          <div style={{ width: '69px' }}>{appointmentDate.format('ddd')}</div>
        </div>
        <div className="vads-u-flex--auto  vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-lightest">
          <div
            style={{
              ...styles.canceled,
              width: '108px',
            }}
          >
            {`${appointmentDate.format('h:mm')} ${appointmentDate
              .format('a')
              .replace(/\./g, '')} ${abbreviation}`}{' '}
          </div>
        </div>
        <div className="vads-u-flex--auto  vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-lightest">
          <div
            className="vads-u-font-weight--bold"
            style={{
              ...styles.canceled,
              width: '297px',
            }}
          >
            {appointmentDetails}
          </div>
        </div>
        <div className="vads-u-flex--1  vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-lightest">
          <div style={styles.canceled}>
            <i
              aria-hidden="true"
              className={classNames('fas', 'vads-u-margin-right--1', {
                'fa-phone': isVAPhoneAppointment(appointment),
                'fa-video': isVideo,
                'fa-building': isInPersonVAAppointment() || isCommunityCare,
              })}
            />

            {appointmentType}
          </div>
        </div>
        <div className="vads-u-flex--auto  vads-u-padding-y--2 vaos-hide-for-print vads-u-border-bottom--1px vads-u-border-color--gray-lightest">
          <Link
            className="vaos-appts__focus--hide-outline"
            aria-label={label}
            to={link}
            onClick={e => e.preventDefault()}
          >
            Details
          </Link>
        </div>
      </div>
    </>
  );
}

Grid.propTypes = {
  appointment: PropTypes.object,
  facility: PropTypes.object,
  handleClick: PropTypes.func,
  handleKeyDown: PropTypes.func,
  link: PropTypes.string,
};
