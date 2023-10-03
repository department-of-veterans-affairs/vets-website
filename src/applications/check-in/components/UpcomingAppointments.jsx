import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeSelectApp } from '../selectors';
import { useGetUpcomingAppointmentsData } from '../hooks/useGetUpcomingAppointmentsData';
import { useUpdateError } from '../hooks/useUpdateError';
import { APP_NAMES } from '../utils/appConstants';
import UpcomingAppointmentsList from './UpcomingAppointmentsList';

const UpcomingAppointments = props => {
  const { router } = props;
  const [isLoading, setIsLoading] = useState(true);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const {
    isComplete,
    upcomingAppointmentsDataError,
  } = useGetUpcomingAppointmentsData(true);

  useEffect(
    () => {
      setIsLoading(!isComplete);
    },
    [isComplete],
  );

  useEffect(
    () => {
      if (upcomingAppointmentsDataError) {
        updateError(
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-upcoming-appointments`,
        );
      }
    },
    [upcomingAppointmentsDataError, updateError, app],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-upcoming-appointment-information')}
        />
      </div>
    );
  }

  if (upcomingAppointmentsDataError) {
    window.scrollTo(0, 0);
    return (
      <div>
        <h2 data-testid="upcoming-appointments-header">
          {t('upcoming-appointments')}
        </h2>
        <p data-testid="upcoming-appointments-error-message">
          {t('error-retrieving-upcoming-appointments')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 data-testid="upcoming-appointments-header">
        {t('upcoming-appointments')}
      </h2>
      <UpcomingAppointmentsList router={router} app={app} />
    </div>
  );
};

UpcomingAppointments.propTypes = {
  router: PropTypes.object,
};

export default UpcomingAppointments;
