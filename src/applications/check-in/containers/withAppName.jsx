import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectApp } from '../selectors';

export const withAppName = Component => {
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const isPreCheckIn = app === 'preCheckIn';
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component isPreCheckIn={isPreCheckIn} {...props} />;
  };
};
