import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { APP_NAMES } from '../utils/appConstants';
import { setApp } from '../actions/universal';

export const withAppSet = (Component, options = {}) => {
  return props => {
    const { isPreCheckIn } = options;
    const app = isPreCheckIn ? APP_NAMES.PRE_CHECK_IN : APP_NAMES.CHECK_IN;
    const dispatch = useDispatch();
    useEffect(
      () => {
        dispatch(setApp(app));
      },
      [app, setApp, dispatch],
    );
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  };
};
