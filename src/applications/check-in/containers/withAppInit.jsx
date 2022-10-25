import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectApp } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';
import { setApp } from '../actions/universal';

export const withAppInit = (Component, options = {}) => {
  return props => {
    const dispatch = useDispatch();
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const { isPreCheckIn } = options;
    const passedApp = isPreCheckIn
      ? APP_NAMES.PRE_CHECK_IN
      : APP_NAMES.CHECK_IN;
    useEffect(
      () => {
        if (!app) {
          dispatch(setApp(passedApp));
        }
      },
      [app, passedApp, dispatch],
    );
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  };
};
