import React from 'react';
import { useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { APPOINTMENT_TYPES, SPACE_BAR } from '../../../utils/constants';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import {
  getAppointmentDate,
  getAppointmentTimezone,
  getLabelText,
  getLink,
  getPractitionerName,
  getVAAppointmentLocationId,
  getVideoAppointmentLocationText,
  isCanceled,
  isInPersonVAAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import { getTypeOfCareById } from '../../../utils/appointment';
import ListItem from './ListItem';
import AppointmentRow from './AppointmentRow';

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
    const practitioner = getPractitionerName(appointment);
    return {
      appointmentDetails: practitioner
        ? `VA Appointment with ${practitioner}`
        : 'VA Appointment',
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
    const { name: typeOfCareName } = getTypeOfCareById(serviceType) || {};
    const practitioner = getPractitionerName(appointment);
    const { name: facilityName } = appointment.vaos.facilityData || {};

    return {
      appointmentDetails:
        typeOfCareName && practitioner
          ? `${typeOfCareName} with ${getPractitionerName(appointment)}`
          : 'VA Appointment',
      appointmentType: facilityName
        ? `In-person at ${facilityName}`
        : 'In-person appointment',
      icon: '',
    };
  }
  return {
    appointmentDetails: '',
    appointmentType: '',
    icon: '',
  };
}

export default function AppointmentListItemGroup({ data }) {
  const history = useHistory();
  const { facilityData } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  // <ul className="vads-u-border-bottom--1px">
  if (Array.isArray(data) === false) return null;

  const appointments = data.filter(
    appointment =>
      appointment.vaos.appointmentType === APPOINTMENT_TYPES.vaAppointment ||
      appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment,
  );
  const isBorderBottom = appointments.length > 1;

  return appointments.map((appointment, index) => {
    const facilityId = getVAAppointmentLocationId(appointment);
    const link = getLink({
      featureBreadcrumbUrlUpdate,
      appointment,
    });
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
    const appointmentDate = getAppointmentDate(appointment);
    const { abbreviation, description } = getAppointmentTimezone(appointment);
    const canceled = isCanceled(appointment);
    const label = getLabelText(appointment);
    const styles = {
      canceled: {
        textDecoration: canceled ? 'line-through' : 'none',
      },
    };
    const { appointmentDetails, appointmentType } = getGridData(appointment);
    const { isCommunityCare, isVideo } = appointment.vaos;

    return (
      <ListItem
        key={index}
        appointment={appointment}
        index={index}
        borderBottom={!isBorderBottom}
        status="upcoming"
      >
        <AppointmentFlexGrid
          key={index}
          index={index}
          appointment={appointment}
          facility={facilityData[facilityId]}
          link={link}
          border
          handleClick={() => handleClick({ history, link, idClickable })}
          handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
        >
          <AppointmentRow className="xsmall-screen:vads-u-flex-direction--row">
            <div
              className={classNames(
                'vads-l-col vads-u-margin-left--1 vads-u-padding-y--1p5',
              )}
            >
              {index === 0 && (
                <>
                  <h3
                    className="vads-u-display--inline-block vads-u-text-align--center vads-u-margin-top--0 vads-u-margin-bottom--0"
                    style={{ width: '24px' }}
                  >
                    {appointmentDate.format('D')}
                  </h3>
                  <span className="vads-u-margin-left--1">
                    {appointmentDate.format('ddd')}
                  </span>
                  <span className="sr-only"> {description}</span>
                </>
              )}
            </div>
            <div
              className={classNames(
                'vads-l-col',
                'vads-u-padding-y--2',
                'vads-u-padding-right--1',
                {
                  'vads-u-border-bottom--1px': isBorderBottom,
                  'vads-u-border-color--gray-medium': isBorderBottom,
                },
              )}
            >
              <div
                style={{
                  ...styles.canceled,
                }}
              >
                {`${appointmentDate.format('h:mm')} ${appointmentDate.format(
                  'a',
                )} ${abbreviation}`}{' '}
              </div>
            </div>
            <div
              className={classNames('vads-l-col--4', 'vads-u-padding-y--2', {
                'vads-u-border-bottom--1px': isBorderBottom,
                'vads-u-border-color--gray-medium': isBorderBottom,
              })}
            >
              <div
                className="vads-u-font-weight--bold"
                style={{
                  ...styles.canceled,
                }}
              >
                {appointmentDetails}
              </div>
            </div>
            <div
              className={classNames('vads-l-col--4', 'vads-u-padding-y--2', {
                'vads-u-border-bottom--1px': isBorderBottom,
                'vads-u-border-color--gray-medium': isBorderBottom,
              })}
            >
              <div style={styles.canceled}>
                <i
                  aria-hidden="true"
                  className={classNames('fas', 'vads-u-margin-right--1', {
                    'fa-phone': isVAPhoneAppointment(appointment),
                    'fa-video': isVideo,
                    'fa-building': isInPersonVAAppointment() || isCommunityCare,
                    'fa-blank': isCommunityCare,
                  })}
                />

                {appointmentType}
              </div>
            </div>
            <div
              className={classNames(
                'vads-l-col',
                'vads-u-margin-right--1',
                'vads-u-padding-y--2',
                'vaos-hide-for-print',
                'vads-u-text-align--right',
                {
                  'vads-u-border-bottom--1px': isBorderBottom,
                  'vads-u-border-color--gray-medium': isBorderBottom,
                },
              )}
            >
              <va-link
                className="vaos-appts__focus--hide-outline"
                aria-label={label}
                href={link}
                onClick={e => e.preventDefault()}
                text="Details"
                role="link"
              />
            </div>
          </AppointmentRow>
        </AppointmentFlexGrid>
      </ListItem>
    );
  });
}

AppointmentListItemGroup.propTypes = {
  data: PropTypes.array.isRequired,
};
