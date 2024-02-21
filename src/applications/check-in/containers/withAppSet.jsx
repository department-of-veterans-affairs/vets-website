import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectApp } from '../selectors';
import { setApp } from '../actions/universal';

export const withAppSet = (Component, options = {}) => {
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const { appName } = options;
    const dispatch = useDispatch();
    useEffect(
      () => {
        if (!app) {
          dispatch(setApp(appName));
        }
      },
      [app, appName, dispatch],
    );
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  };
};
