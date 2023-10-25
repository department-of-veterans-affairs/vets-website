import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { useGetUpcomingAppointmentsData } from '../hooks/useGetUpcomingAppointmentsData';
import { useUpdateError } from '../hooks/useUpdateError';
import { APP_NAMES } from '../utils/appConstants';
import UpcomingAppointmentsList from './UpcomingAppointmentsList';

const UpcomingAppointments = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const {
    isComplete: isUpcomingComplete,
    isLoading: isUpcomingLoading,
    upcomingAppointmentsDataError,
    refreshUpcomingData,
  } = useGetUpcomingAppointmentsData({ refreshNeeded: false });
  const [isComplete, setIsComplete] = useState(isUpcomingComplete);
  const [isLoading, setIsLoading] = useState(isUpcomingLoading);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { upcomingAppointments } = useSelector(selectVeteranData);

  useEffect(
    () => {
      if (!upcomingAppointments.length && !isComplete) {
        refreshUpcomingData();
      }
      return () => {
        setIsComplete(isUpcomingComplete);
        setIsLoading(isUpcomingLoading);
      };
    },
    [
      upcomingAppointments,
      isComplete,
      refreshUpcomingData,
      isUpcomingComplete,
      isUpcomingLoading,
    ],
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

  let body = '';

  if (isLoading) {
    window.scrollTo(0, 0);
    body = (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-upcoming-appointment-information')}
        />
      </div>
    );
  } else if (upcomingAppointmentsDataError) {
    window.scrollTo(0, 0);
    body = (
      <p data-testid="upcoming-appointments-error-message">
        {t('error-retrieving-upcoming-appointments')}
      </p>
    );
  } else {
    body = (
      <UpcomingAppointmentsList
        router={router}
        app={app}
        upcomingAppointments={upcomingAppointments}
      />
    );
  }

  return (
    <section data-testid="upcoming-appointments">
      <h2 data-testid="upcoming-appointments-header">
        {t('upcoming-appointments')}
      </h2>
      {body}
    </section>
  );
};

UpcomingAppointments.propTypes = {
  router: PropTypes.object,
};

export default UpcomingAppointments;
