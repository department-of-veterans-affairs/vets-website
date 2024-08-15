import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import Wrapper from '../../layout/Wrapper';
import UpcomingAppointmentsList from '../../UpcomingAppointmentsList';
import AppointmentListInfoBlock from '../../AppointmentListInfoBlock';

import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { useGetUpcomingAppointmentsData } from '../../../hooks/useGetUpcomingAppointmentsData';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { APP_NAMES } from '../../../utils/appConstants';

const UpcomingAppointmentsPage = props => {
  const { router } = props;
  const [refresh, setRefresh] = useState(false);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const {
    isComplete,
    isLoading,
    upcomingAppointmentsDataError,
    refreshUpcomingData,
  } = useGetUpcomingAppointmentsData({ refreshNeeded: false });

  const selectVeteranData = useMemo(makeSelectVeteranData, []);

  const { upcomingAppointments } = useSelector(selectVeteranData);

  useEffect(
    () => {
      if (!upcomingAppointments.length && !isComplete && !isLoading) {
        refreshUpcomingData();
      }
    },
    [upcomingAppointments, isComplete, refreshUpcomingData, isLoading],
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
          {t('we-cant-access-appointments')}
        </h3>
        <p className="vads-u-margin-bottom--0">
          {t('were-sorry-theres-a-problem-with-system')}
        </p>
      </va-alert>
    );
  } else {
    body = (
      <>
        <UpcomingAppointmentsList
          router={router}
          app={app}
          upcomingAppointments={upcomingAppointments}
        />
        <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column vads-u-padding-top--1p5 vads-u-padding-bottom--5">
          <p data-testid="update-text">
            <Trans
              i18nKey="latest-update"
              components={{ bold: <strong /> }}
              values={{ date: new Date() }}
            />
          </p>
          <va-button
            uswds
            text={t('refresh')}
            big
            onClick={() => setRefresh(true)}
            secondary
            data-testid="refresh-appointments-button"
          />
        </div>
      </>
    );
  }

  return (
    <Wrapper pageTitle={t('upcoming-appointments')} withBackButton>
      <section data-testid="upcoming-appointments-vaos">
        <h2 data-testid="upcoming-appointments-header">
          {t('upcoming-appointments')}
        </h2>
        {body}
        <AppointmentListInfoBlock />
      </section>
    </Wrapper>
  );
};

UpcomingAppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default UpcomingAppointmentsPage;
