import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { APP_NAMES } from '../../utils/appConstants';
import { makeSelectCurrentContext, makeSelectForm } from '../../selectors';
import { setForm } from '../../actions/universal';
import { createSetSession } from '../../actions/authentication';
import { useStorage } from '../../hooks/useStorage';
import { useGetCheckInData } from '../../hooks/useGetCheckInData';
import { useUpdateError } from '../../hooks/useUpdateError';

const ReloadWrapper = props => {
  const { children, router, app } = props;
  const location = window.location.pathname;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // @TODO change this when useStorage gets refactored to no use isPreCheckIn
  const {
    getProgressState,
    setProgressState,
    getCurrentToken,
    getPermissions,
  } = useStorage(app === APP_NAMES.PRE_CHECK_IN);
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
  const [refreshData, setRefreshData] = useState(true);

  const sessionToken = getCurrentToken(window);
  const { token: reduxToken } = useSelector(selectCurrentContext);

  useEffect(
    () => {
      if (checkInDataError) {
        updateError('reload-data-error');
      }
    },
    [checkInDataError, updateError],
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
      dispatch,
      getPermissions,
      progressState,
    ],
  );

  useEffect(
    () => {
      setProgressState(window, currentForm);
    },
    [currentForm, setProgressState],
  );

  if (refreshData || isLoading) {
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
