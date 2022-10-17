import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import classNames from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import Grid from './Grid';
import { SPACE_BAR } from '../../../utils/constants';
import {
  getLabelText,
  getPractitionerName,
  // getPreferredCommunityCareProviderName,
  getVAAppointmentLocationId,
  getVideoAppointmentLocationText,
  isCanceled,
  isInPersonVAAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { getTypeOfCareById } from '../../../utils/appointment';
import ListItem from './ListItem';

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

    return {
      appointmentDetails:
        typeOfCareName && practitioner
          ? `${typeOfCareName} with ${getPractitionerName(appointment)}`
          : 'VA Appointment',
      appointmentType: 'In person',
      icon: '',
    };
  }
  return {
    appointmentDetails: '',
    appointmentType: '',
    icon: '',
  };
}

export default function RequestListItemGroup({ data, facilityData }) {
  const history = useHistory();

  return data.map((appointment, index) => {
    const link = `requests/${appointment.id}`;
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
    const label = getLabelText(appointment);
    const styles = {
      canceled: {
        textDecoration: isCanceled(appointment) ? 'line-through' : 'none',
      },
    };
    const { appointmentType } = getGridData(appointment);
    const { isCommunityCare, isVideo } = appointment?.vaos || {};

    // const isCC = appointment.vaos.isCommunityCare;
    const { name: typeOfCareName } =
      getTypeOfCareById(appointment?.vaos.apiData.serviceType) || {};
    // const ccFacilityName = getPreferredCommunityCareProviderName(appointment);
    const facility = facilityData[getVAAppointmentLocationId(appointment)];

    return (
      <ListItem
        key={index}
        appointment={appointment}
        index={index}
        borderTop
        status="pending"
      >
        <Grid
          key={index}
          index={index}
          appointment={appointment}
          facility={facility}
          link={link}
          border
          handleClick={() => handleClick({ history, link, idClickable })}
          handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
        >
          <div className={classNames('vads-l-col', 'vads-u-padding-y--2')}>
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
          <div
            className={classNames('vads-l-col', 'vads-u-padding-y--2')}
            style={styles.canceled}
          >
            {typeOfCareName}
          </div>
          <div className={classNames('vads-l-col', 'vads-u-padding-y--2')}>
            <div
              style={{
                ...styles.canceled,
              }}
            >
              {/* {!!facility && !isCC && facility.name} */}
              {/* {isCC && ccFacilityName} */}
              {facility?.name}
            </div>
          </div>
          <div
            className={classNames(
              'vads-l-col',
              'vads-u-padding-y--2',
              'vaos-hide-for-print',

              'vads-u-text-align--right',
            )}
          >
            <Link
              className="vaos-appts__focus--hide-outline"
              aria-label={label}
              to={link}
              onClick={e => e.preventDefault()}
            >
              Details
            </Link>
          </div>
        </Grid>
      </ListItem>
    );
  });
}

RequestListItemGroup.propTypes = {
  data: PropTypes.array.isRequired,
  facility: PropTypes.object,
};
