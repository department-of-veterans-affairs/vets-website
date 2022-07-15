import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import AppointmentLocation from './AppointmentLocation';

import AppointmentAction from './AppointmentAction';

const AppointmentListItem = props => {
  const { appointment, token, router } = props;
  const appointmentDateTime = new Date(appointment.startTime);
  const { t } = useTranslation();
  const itemID = nanoid();
  return (
    <li className="appointment-item vads-u-padding--2">
      <div className="appointment-summary vads-u-margin--0 vads-u-padding--0">
        <h2
          className="appointment-time vads-u-font-family--serif vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--0"
          data-testid="appointment-time"
          aria-describedby={itemID}
        >
          {t('date-time', { date: appointmentDateTime })}
        </h2>
        <div id={itemID}>
          <p className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-weight--bold ">
            <span className="facility-label vads-u-margin-right--1">
              {t('facility')}:{' '}
            </span>
            <span data-testid="facility-name">{appointment.facility}</span>
          </p>
          <p className="vads-u-margin--0 vads-u-font-family--serif vads-u-font-weight--bold ">
            <span className="clinic-label vads-u-margin-right--1">
              {t('clinic')}:{' '}
            </span>
            <span data-testid="clinic-name">
              <AppointmentLocation appointment={appointment} />
            </span>
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
