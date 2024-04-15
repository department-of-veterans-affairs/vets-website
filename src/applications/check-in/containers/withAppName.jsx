import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectApp } from '../selectors';

export const withAppName = Component => {
  return props => {
    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component app={app} {...props} />;
  };
};
