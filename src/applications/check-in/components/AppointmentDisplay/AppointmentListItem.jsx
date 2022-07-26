import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppointmentLocation from './AppointmentLocation';

import AppointmentAction from './AppointmentAction';

const AppointmentListItem = props => {
  const { appointment, token, router } = props;
  const appointmentDateTime = new Date(appointment.startTime);
  const { t } = useTranslation();
  const apptId = `${appointment.stationNo ? appointment.stationNo : ''}${
    appointment.appointmentIen
  }`;
  return (
    <li className="appointment-item vads-u-padding--2">
      <div className="appointment-summary vads-u-margin--0 vads-u-padding--0">
        <h2
          className="appointment-time vads-u-font-family--serif vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--0"
          data-testid="appointment-time"
          aria-describedby={apptId}
        >
          {t('date-time', { date: appointmentDateTime })}
        </h2>
        <div id={apptId}>
          <p className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-family--serif vads-u-font-weight--bold appointment-detail">
            <span className="item-label">{t('facility')}: </span>
            <span className="item-value" data-testid="facility-name">
              {appointment.facility}
            </span>
            <span className="item-label">{t('clinic')}: </span>
            <span className="item-value" data-testid="clinic-name">
              <AppointmentLocation appointment={appointment} />
            </span>
            {appointment.clinicLocation && (
              <>
                <span className="item-label">{t('location')}: </span>
                <span className="item-value" data-testid="clinic-location">
                  {appointment.clinicLocation}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      <AppointmentAction
        appointment={appointment}
        router={router}
        token={token}
      />
    </li>
  );
};

AppointmentListItem.propTypes = {
  appointment: PropTypes.object,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentListItem;
