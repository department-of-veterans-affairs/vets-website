import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../utils/analytics';
import AppointmentListItemVaos from './AppointmentDisplay/AppointmentListItemVaos';
import { makeSelectApp } from '../selectors';
import { useFormRouting } from '../hooks/useFormRouting';
import { APP_NAMES } from '../utils/appConstants';
import { getAppointmentId } from '../utils/appointment';

const AppointmentBlockVaos = props => {
  const { appointments, page, router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const appointmentsDateTime = new Date(appointments[0].startTime);

  const { jumpToPage } = useFormRouting(router);

  const handleDetailClick = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
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
        <p className="vads-u-font-family--serif" data-testid="date-text">
          {t('here-are-your-appointments-for-today', { date: new Date() })}
        </p>
      )}

      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list appointment-list"
        data-testid="appointment-list"
      >
        {appointments.map(appointment => {
          return (
            <AppointmentListItemVaos
              key={`${appointment.appointmentIen}-${appointment.stationNo}`}
              appointment={appointment}
              page={page}
              goToDetails={handleDetailClick}
              app={app}
              router={router}
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
};

export default AppointmentBlockVaos;
