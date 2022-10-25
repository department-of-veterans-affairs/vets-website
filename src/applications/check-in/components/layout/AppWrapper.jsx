import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectCurrentContext, makeSelectForm } from '../../selectors';
import { setForm } from '../../actions/universal';
import { createSetSession } from '../../actions/authentication';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useGetCheckInData } from '../../hooks/useGetCheckInData';
import { useFormRouting } from '../../hooks/useFormRouting';

const AppWrapper = props => {
  const { children, router } = props;
  const location = window.location.pathname;
  const dispatch = useDispatch();
  const {
    getProgressState,
    setProgressState,
    getCurrentToken,
    getPermissions,
  } = useSessionStorage(false);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const selectForm = useMemo(makeSelectForm, []);
  const currentForm = useSelector(selectForm);
  const progressState = getProgressState(window);
  const { checkInDataError, refreshCheckInData } = useGetCheckInData(
    false,
    true,
    true,
  );
  const [refreshData, setRefreshData] = useState(true);

  const { goToErrorPage } = useFormRouting(router);
  const url = location.split('/');
  const pageFromUrl = url[3];
  const sessionToken = getCurrentToken(window);
  const { token: reduxToken } = useSelector(selectCurrentContext);

  useEffect(
    () => {
      if (
        !reduxToken &&
        sessionToken?.token &&
        pageFromUrl &&
        pageFromUrl !== 'verify'
      ) {
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
        }
      } else {
        setRefreshData(false);
      }
    },
    [reduxToken, sessionToken, pageFromUrl, refreshCheckInData, dispatch],
  );

  useEffect(
    () => {
      setProgressState(window, currentForm);
    },
    [currentForm],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        goToErrorPage('?error=reload-data-error');
      }
    },
    [checkInDataError],
  );
  return <>{refreshData ? <va-loading-indicator /> : children}</>;
};

AppWrapper.propTypes = {
  children: PropTypes.node,
};

export default AppWrapper;
