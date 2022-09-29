import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectApp } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';
import { setApp } from '../actions/universal';

export const withAppSet = (Component, options = {}) => {
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const { isPreCheckIn } = options;
    const passedApp = isPreCheckIn
      ? APP_NAMES.PRE_CHECK_IN
      : APP_NAMES.CHECK_IN;
    const dispatch = useDispatch();
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
