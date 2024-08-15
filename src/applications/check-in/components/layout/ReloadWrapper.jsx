import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectCurrentContext, makeSelectForm } from '../../selectors';
import { setForm } from '../../actions/universal';
import { createSetSession } from '../../actions/authentication';
import { useStorage } from '../../hooks/useStorage';
import { useGetCheckInData } from '../../hooks/useGetCheckInData';
import { useGetUpcomingAppointmentsData } from '../../hooks/useGetUpcomingAppointmentsData';
import { useUpdateError } from '../../hooks/useUpdateError';
import {
  CONFIG_STALE_DURATION,
  CONFIG_STALE_REDIRECT_LOCATION,
} from '../../utils/appConstants';

const ReloadWrapper = props => {
  const { children, router, app, reloadUpcoming } = props;
  const location = window.location.pathname;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    getProgressState,
    setProgressState,
    getCurrentToken,
    getPermissions,
    getCompleteTimestamp,
  } = useStorage(app);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const selectForm = useMemo(makeSelectForm, []);
  const currentForm = useSelector(selectForm);
  const { updateError } = useUpdateError();
  const progressState = getProgressState(window);
  const { checkInDataError, refreshCheckInData, isLoading } = useGetCheckInData(
    {
      refreshNeeded: false,
      appointmentsOnly: true,
      reload: true,
      router,
      app,
    },
  );
  const {
    upcomingAppointmentsDataError,
    refreshUpcomingData,
    isLoading: isUpcomingLoading,
  } = useGetUpcomingAppointmentsData({
    refreshNeeded: false,
  });
  const [refreshData, setRefreshData] = useState(true);

  const sessionToken = getCurrentToken(window);
  const { token: reduxToken } = useSelector(selectCurrentContext);

  const completeTimeStamp = getCompleteTimestamp(window);

  useEffect(
    () => {
      if (completeTimeStamp) {
        const timeSinceComplete = Date.now() - completeTimeStamp;
        if (timeSinceComplete > CONFIG_STALE_DURATION[app]) {
          window.location = CONFIG_STALE_REDIRECT_LOCATION[app];
        }
      }
    },
    [completeTimeStamp, app],
  );

  useEffect(
    () => {
      if (checkInDataError || upcomingAppointmentsDataError) {
        updateError('reload-data-error');
      }
    },
    [checkInDataError, upcomingAppointmentsDataError, updateError],
  );

  useEffect(
    () => {
      if (!reduxToken && sessionToken?.token) {
        const savedPermissions = getPermissions(window);
        const savedToken = sessionToken.token;
        if (savedPermissions && savedToken) {
          dispatch(setForm(progressState));
          dispatch(
            createSetSession({
              token: savedToken,
              permissions: savedPermissions,
            }),
          );
          refreshCheckInData();
          if (reloadUpcoming) {
            refreshUpcomingData();
          }
        } else {
          setRefreshData(false);
        }
      } else {
        setRefreshData(false);
      }
    },
    [
      reduxToken,
      sessionToken,
      location,
      refreshCheckInData,
      refreshUpcomingData,
      dispatch,
      getPermissions,
      progressState,
      reloadUpcoming,
    ],
  );

  useEffect(
    () => {
      setProgressState(window, currentForm);
    },
    [currentForm, setProgressState],
  );

  if (refreshData || isLoading || isUpcomingLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator message={t('loading')} />
      </div>
    );
  }
  return <>{children}</>;
};

ReloadWrapper.propTypes = {
  app: PropTypes.string.isRequired,
  children: PropTypes.node,
  router: PropTypes.object,
};

export default ReloadWrapper;
