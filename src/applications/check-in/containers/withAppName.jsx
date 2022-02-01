import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectApp } from '../selectors';

export const withAppName = Component => {
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    const isPreCheckIn = app === 'preCheckIn';

    return <Component isPreCheckIn={isPreCheckIn} {...props} />;
  };
};
