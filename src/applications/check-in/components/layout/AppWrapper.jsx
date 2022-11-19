import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectCurrentContext, makeSelectForm } from '../../selectors';
import { setForm } from '../../actions/universal';
import { createSetSession } from '../../actions/authentication';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useGetCheckInData } from '../../hooks/useGetCheckInData';
import { useFormRouting } from '../../hooks/useFormRouting';
import { isAnInternalPage } from '../../utils/navigation';

const AppWrapper = props => {
  const { children, router, isPreCheckIn } = props;
  const location = window.location.pathname;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    getProgressState,
    setProgressState,
    getCurrentToken,
    getPermissions,
  } = useSessionStorage(isPreCheckIn);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const selectForm = useMemo(makeSelectForm, []);
  const currentForm = useSelector(selectForm);
  const progressState = getProgressState(window);
  const { checkInDataError, refreshCheckInData, isLoading } = useGetCheckInData(
    {
      refreshNeeded: false,
      appointmentsOnly: true,
      reload: true,
      router,
      isPreCheckIn,
    },
  );
  const [refreshData, setRefreshData] = useState(true);

  const { goToErrorPage } = useFormRouting(router);
  const sessionToken = getCurrentToken(window);
  const { token: reduxToken } = useSelector(selectCurrentContext);
  const validReloadPage = isAnInternalPage(location);

  const loadingMessage = (
    <>
      <va-loading-indicator message={t('loading')} />
    </>
  );

  useEffect(
    () => {
      if (checkInDataError) {
        goToErrorPage('?error=reload-data-error');
      }
    },
    [checkInDataError, goToErrorPage],
  );

  useEffect(
    () => {
      if (!reduxToken && sessionToken?.token && validReloadPage) {
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
      validReloadPage,
      progressState,
    ],
  );

  useEffect(
    () => {
      setProgressState(window, currentForm);
    },
    [currentForm, setProgressState],
  );

  return <>{refreshData || isLoading ? loadingMessage : children}</>;
};

AppWrapper.propTypes = {
  children: PropTypes.node,
  isPreCheckIn: PropTypes.bool,
  router: PropTypes.object,
};

export default AppWrapper;
