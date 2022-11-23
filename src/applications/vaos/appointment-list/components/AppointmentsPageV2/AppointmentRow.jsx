import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getAppointmentDate,
  getAppointmentTimezone,
  getLabelText,
  getLink,
  getPractitionerName,
  getVideoAppointmentLocationText,
  isCanceled,
  isInPersonVAAppointment,
  isVAPhoneAppointment,
} from '../../../services/appointment';
import { getTypeOfCareById } from '../../../utils/appointment';
import { SPACE_BAR } from '../../../utils/constants';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';

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
  const { name: typeOfCareName } = getTypeOfCareById(serviceType) || {};

  if (isCommunityCare) {
    return {
      appointmentDetails: 'Community care',
      appointmentType: 'Community care',
      icon: 'fa-building',
      typeOfCareName,
    };
  }

  if (isVideo) {
    const practitioner = getPractitionerName(appointment);
    return {
      appointmentDetails: practitioner
        ? `VA Appointment with ${practitioner}`
        : 'VA Appointment',
      appointmentType: getVideoAppointmentLocationText(appointment),
      icon: 'fa-video',
      typeOfCareName,
    };
  }

  if (isPhone) {
    return {
      appointmentDetails: 'VA Appointment',
      appointmentType: 'Phone call',
      icon: 'fa-phone',
      typeOfCareName,
    };
  }

  if (isInPersonVAAppointment()) {
    const practitioner = getPractitionerName(appointment);

    return {
      appointmentDetails:
        typeOfCareName && practitioner
          ? `${typeOfCareName} with ${getPractitionerName(appointment)}`
          : 'VA Appointment',
      appointmentType: 'In person',
      icon: 'fa-building',
      typeOfCareName,
    };
  }

  return {
    appointmentDetails: '',
    appointmentType: '',
    icon: '',
  };
}

export const DataContext = createContext({});

export default function AppointmentRow({
  appointment,
  children,
  facility,
  isMobile,
}) {
  const history = useHistory();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const appointmentDate = getAppointmentDate(appointment);
  const { abbreviation, description } = getAppointmentTimezone(appointment);
  const canceled = isCanceled(appointment);
  const label = getLabelText(appointment);

  const data = getGridData(appointment);
  data.ariaLabel = getLabelText(appointment);

  data.link = getLink({
    featureStatusImprovement,
    appointment,
  });
  data.label = label;
  data.canceled = canceled;
  data.appointmentDate = appointmentDate;
  data.abbreviation = abbreviation;
  data.description = description;
  data.facility = facility;
  data.isBorderBottom = false;

  return (
    <DataContext.Provider value={{ data }}>
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        id="row"
        className={classNames('vads-l-row', {
          'vads-u-flex-direction--column': isMobile,
        })}
        onClick={handleClick({ history, link: data.link, idClickable })}
        onKeyDown={handleKeyDown({ history, link: data.link, idClickable })}
      >
        {children}
      </div>
    </DataContext.Provider>
  );
}

AppointmentRow.propTypes = {
  appointment: PropTypes.object,
  children: PropTypes.object,
  facility: PropTypes.object,
  isMobile: PropTypes.bool,
};
