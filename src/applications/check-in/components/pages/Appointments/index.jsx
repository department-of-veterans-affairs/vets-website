import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { useStorage } from '../../../hooks/useStorage';
import UpcomingAppointmentsVista from '../../UpcomingAppointmentsVista';
import ActionItemDisplay from '../../ActionItemDisplay';
import LinkList from '../../LinkList';

import { intervalUntilNextAppointmentIneligibleForCheckin } from '../../../utils/appointment';
import AppointmentListInfoBlock from '../../AppointmentListInfoBlock';

const AppointmentsPage = props => {
  const { router } = props;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isUpcomingAppointmentsEnabled } = useSelector(selectFeatureToggles);
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const [loadedAppointments, setLoadedAppointments] = useState(appointments);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { getCheckinComplete } = useStorage(APP_NAMES.CHECK_IN);

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
      if (getCheckinComplete(window)) {
        setRefresh(true);
      }
    },
    [getCheckinComplete],
  );

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
      pageTitle={t('#-util-capitalize', {
        value: t('appointments_other'),
      })}
      withBackButton
    >
      <ActionItemDisplay router={router} />
      <UpcomingAppointmentsVista router={router} appointments={appointments} />
      <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column vads-u-padding-top--1p5 vads-u-padding-bottom--5">
        <p data-testid="update-text">
          <Trans
            i18nKey="latest-update"
            components={{ bold: <strong /> }}
            values={{ date: new Date() }}
          />
        </p>
        {app === APP_NAMES.CHECK_IN && (
          <va-button
            uswds
            text={t('refresh')}
            big
            onClick={() => setRefresh(true)}
            secondary
            data-testid="refresh-appointments-button"
          />
        )}
        {isUpcomingAppointmentsEnabled && <LinkList router={router} />}
      </div>
      <AppointmentListInfoBlock />
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;
