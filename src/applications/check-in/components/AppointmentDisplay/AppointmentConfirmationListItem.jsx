import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
      data-testid={`appointment-list-item-${index}`}
    >
      <dl className="check-in--appointment-summary">
        <dt className="check-in--label vads-u-margin-right--1">{t('time')}:</dt>
        <dd className="check-in--value" data-testid="appointment-time">
          {t('date-time', { date: appointmentDateTime })}
        </dd>
        <dt className="check-in--label vads-u-margin-right--1">
          {t('clinic')}:
        </dt>
        <dd className="check-in--value" data-testid="appointment-clinic">
          {clinic}
        </dd>
      </dl>
    </li>
  );
};

AppointmentConfirmationListItem.propTypes = {
  appointment: PropTypes.object,
  index: PropTypes.number,
};

export default AppointmentConfirmationListItem;
