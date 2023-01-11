import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AppointmentListItemVaos from './AppointmentListItemVaos';
import AppointmentActionVaos from './AppointmentDisplay/AppointmentActionVaos';
import { setActiveAppointment } from '../actions/universal';
import { makeSelectApp } from '../selectors';
import { useFormRouting } from '../hooks/useFormRouting';
import { APP_NAMES } from '../utils/appConstants';

const AppointmentBlockVaos = props => {
  const { appointments, page, router, token } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const appointmentsDateTime = new Date(appointments[0].startTime);

  const dispatch = useDispatch();
  const { jumpToPage } = useFormRouting(router);

  const handleDetailClick = (appointmentIen, e) => {
    e.preventDefault();
    dispatch(setActiveAppointment(appointmentIen));
    jumpToPage('appointment-details');
  };

  return (
    <div>
      {app === APP_NAMES.PRE_CHECK_IN ? (
        <p
          className="vads-u-font-family--serif"
          data-testid="appointment-day-location"
        >
          {t('your-appointments-on-day', {
            count: appointments.length,
            day: appointmentsDateTime,
          })}
        </p>
      ) : (
        <p data-testid="date-text">
          {t('here-are-your-appointments-for-today', { date: new Date() })}
        </p>
      )}

      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map(appointment => {
          return (
            <AppointmentListItemVaos
              key={`${appointment.appointmentIen}-${appointment.stationNo}`}
              appointment={appointment}
              showDetailsLink={page === 'confirmation' || page === 'details'}
              goToDetails={handleDetailClick}
              AppointmentAction={
                <AppointmentActionVaos
                  appointment={appointment}
                  router={router}
                  token={token}
                />
              }
            />
          );
        })}
      </ol>
    </div>
  );
};

AppointmentBlockVaos.propTypes = {
  appointments: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default AppointmentBlockVaos;
