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
  const { router, refresh } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const {
    isComplete,
    isLoading: isUpcomingLoading,
    upcomingAppointmentsDataError,
    refreshUpcomingData,
  } = useGetUpcomingAppointmentsData({ refreshNeeded: false });
  const [isLoading, setIsLoading] = useState(true);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { upcomingAppointments } = useSelector(selectVeteranData);

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!upcomingAppointments.length && !isComplete && !isUpcomingLoading) {
        refreshUpcomingData();
      } else if (upcomingAppointments.length) {
        setIsLoading(false);
      }
    },
    [upcomingAppointments, isComplete, refreshUpcomingData, isUpcomingLoading],
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

  useEffect(
    () => {
      if (refresh) {
        refreshUpcomingData();
      }
    },
    [refresh, refreshUpcomingData],
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
      <va-alert
        data-testid="upcoming-appointments-error-message"
        status="error"
      >
        <h3 className="vads-u-margin-top--0">
          {t('were-sorry-weve-run-into-a-problem')}
        </h3>
        <p className="vads-u-margin-bottom--0">
          {t('were-having-trouble-getting-your-upcoming-appointments')}
        </p>
      </va-alert>
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
  refresh: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
};

export default UpcomingAppointments;
