import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { useUpdateError } from '../../../hooks/useUpdateError';
import UpcomingAppointments from '../../UpcomingAppointments';
import ActionItemDisplay from '../../ActionItemDisplay';

import { intervalUntilNextAppointmentIneligibleForCheckin } from '../../../utils/appointment';

const AppointmentsPage = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const [loadedAppointments, setLoadedAppointments] = useState(appointments);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const {
    isComplete,
    isLoading: isDataLoading,
    checkInDataError,
    refreshCheckInData,
  } = useGetCheckInData({
    refreshNeeded: false,
    router,
    app,
  });

  const refreshTimer = useRef(null);

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!loadedAppointments.length && !isComplete && !isDataLoading) {
        refreshCheckInData();
      } else if (loadedAppointments.length) {
        setIsLoading(false);
      }
    },
    [isComplete, isDataLoading, refreshCheckInData, loadedAppointments],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        updateError(
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-appointments`,
        );
      }
    },
    [checkInDataError, updateError, app],
  );

  useEffect(
    () => {
      if (refresh) {
        refreshCheckInData();
        setLoadedAppointments([]);
        setRefresh(false);
      }
    },
    [refresh, refreshCheckInData],
  );

  useEffect(
    () => {
      if (app === APP_NAMES.CHECK_IN) {
        const refreshInterval = intervalUntilNextAppointmentIneligibleForCheckin(
          appointments,
        );

        // Refresh the page 5 seconds before the checkIn window expires.
        if (refreshInterval > 5000) {
          if (refreshTimer.current !== null) {
            clearTimeout(refreshTimer.current);
          }

          refreshTimer.current = setTimeout(
            () => refreshCheckInData(),
            refreshInterval - 5000,
          );
        }

        if (checkInDataError) {
          updateError('cant-retrieve-check-in-data');
        }
      }
    },
    [appointments, checkInDataError, updateError, refreshCheckInData, app],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-appointment-information')}
        />
      </div>
    );
  }
  return (
    <Wrapper
      pageTitle={t('#-util-capitalize', { value: t('appointments') })}
      withBackButton
    >
      <ActionItemDisplay router={router} />
      <UpcomingAppointments router={router} refresh={refresh} />
      <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column vads-u-border-top--1px vads-u-padding-top--1p5">
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
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;
