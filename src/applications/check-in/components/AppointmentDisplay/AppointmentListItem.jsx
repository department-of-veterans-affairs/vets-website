import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppointmentLocation from './AppointmentLocation';

import AppointmentAction from './AppointmentAction';

const AppointmentListItem = props => {
  const { appointment, token, router } = props;
  const appointmentDateTime = new Date(appointment.startTime);
  const { t } = useTranslation();
  return (
    <li className="appointment-item vads-u-padding--2">
      <dl className="appointment-summary vads-u-margin--0 vads-u-padding--0">
        <dd
          className="appointment-time vads-u-font-family--serif vads-u-font-weight--bold vads-u-margin-bottom--1 "
          data-testid="appointment-time"
        >
          {t('date-time', { date: appointmentDateTime })}
        </dd>
        <dt className="facility-label vads-u-margin--0 vads-u-margin-right--1 vads-u-font-family--serif vads-u-font-weight--bold ">
          {t('facility')}:{' '}
        </dt>
        <dd
          data-testid="facility-name"
          className="facility-name vads-u-font-weight--bold vads-u-font-family--serif "
        >
          {appointment.facility}
        </dd>
        <dt className="clinic-label  vads-u-margin--0 vads-u-margin-right--1 vads-u-margin-bottom--1 vads-u-font-family--serif vads-u-font-weight--bold">
          {t('clinic')}:{' '}
        </dt>
        <dd
          data-testid="clinic-name"
          className="clinic-name  vads-u-font-weight--bold vads-u-font-family--serif"
        >
          <AppointmentLocation appointment={appointment} />
        </dd>
      </dl>
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
