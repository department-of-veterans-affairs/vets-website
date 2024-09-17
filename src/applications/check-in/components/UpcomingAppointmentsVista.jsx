import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeSelectApp } from '../selectors';
import UpcomingAppointmentsList from './UpcomingAppointmentsList';
import { APP_NAMES } from '../utils/appConstants';

const UpcomingAppointments = props => {
  const { router, appointments } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const heading =
    app === APP_NAMES.CHECK_IN
      ? t('todays-appointments-at-this-facility')
      : t('your-appointments', { count: appointments.length });
  return (
    <section data-testid="upcoming-appointments-vista">
      <h2 data-testid="upcoming-appointments-header-vista">{heading}</h2>
      <UpcomingAppointmentsList
        router={router}
        app={app}
        upcomingAppointments={appointments}
      />
    </section>
  );
};

UpcomingAppointments.propTypes = {
  appointments: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
};

export default UpcomingAppointments;
