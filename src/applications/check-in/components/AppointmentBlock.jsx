import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { createAnalyticsSlug } from '../utils/analytics';
import AppointmentListItem from './AppointmentDisplay/AppointmentListItem';
import { makeSelectApp } from '../selectors';
import { useFormRouting } from '../hooks/useFormRouting';
import {
  getAppointmentId,
  sortAppointmentsByStartTime,
} from '../utils/appointment';

const AppointmentBlock = props => {
  const { appointments, page, router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();

  const { jumpToPage } = useFormRouting(router);

  const handleDetailClick = (e, appointment) => {
    e.preventDefault();
    recordEvent({
      event: createAnalyticsSlug('details-link-clicked', 'nav', app),
    });
    jumpToPage(`appointment-details/${getAppointmentId(appointment)}`);
  };

  const sortedAppointments = sortAppointmentsByStartTime(appointments);

  return (
    <div>
      <h2 className="vads-u-margin-top--0" data-testid="appointment-text">
        {t('your-appointments', { count: sortedAppointments.length })}
      </h2>
      <ul
        className="vads-u-border-top--1px vads-u-border-color--gray-light vads-u-margin-bottom--4 check-in--appointment-list appointment-list"
        data-testid="appointment-list"
      >
        {sortedAppointments.map(appointment => {
          return (
            <AppointmentListItem
              key={`${appointment.appointmentIen}-${appointment.stationNo}`}
              appointment={appointment}
              page={page}
              goToDetails={handleDetailClick}
              app={app}
              router={router}
            />
          );
        })}
      </ul>
    </div>
  );
};

AppointmentBlock.propTypes = {
  appointments: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  router: PropTypes.object,
};

export default AppointmentBlock;
