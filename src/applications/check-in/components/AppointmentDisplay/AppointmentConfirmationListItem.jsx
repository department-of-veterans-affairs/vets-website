import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { locationShouldBeDisplayed } from '../../utils/appointment';

const AppointmentConfirmationListItem = props => {
  const { appointment, index = 0 } = props;
  const { t } = useTranslation();

  const appointmentDateTime = new Date(appointment.startTime);
  const clinic = appointment.clinicFriendlyName
    ? appointment.clinicFriendlyName
    : appointment.clinicName;

  return (
    <li
      key={index}
      className="vads-u-border-bottom--1px check-in--appointment-item"
      data-testid="appointment-list-item"
    >
      <div className="check-in--appointment-summary vads-u-margin-bottom--2 vads-u-margin-top--2">
        <div className="check-in--label vads-u-margin-right--1">
          {t('time')}:
        </div>
        <div className="check-in--value" data-testid="appointment-time">
          {t('date-time', { date: appointmentDateTime })}
        </div>
        <div className="check-in--label vads-u-margin-right--1">
          {t('type-of-care')}:
        </div>
        <div className="check-in--value" data-testid="type-of-care">
          {appointment.clinicStopCodeName ?? t('VA-appointment')}
        </div>
        {appointment.doctorName && (
          <>
            <div className="check-in--label vads-u-margin-right--1">
              {t('provider')}:
            </div>
            <div className="check-in--value" data-testid="provider">
              {appointment.doctorName}
            </div>
          </>
        )}
        <div className="check-in--label vads-u-margin-right--1">
          {t('clinic')}:
        </div>
        <div className="check-in--value" data-testid="appointment-clinic">
          {clinic}
        </div>
        {locationShouldBeDisplayed(appointment) && (
          <>
            <div className="check-in--label vads-u-margin-right--1">
              {t('location')}:
            </div>
            <div className="check-in--value" data-testid="clinic-location">
              {appointment.clinicLocation}
            </div>
          </>
        )}
      </div>
    </li>
  );
};

AppointmentConfirmationListItem.propTypes = {
  appointment: PropTypes.object,
  index: PropTypes.string,
};

export default AppointmentConfirmationListItem;
