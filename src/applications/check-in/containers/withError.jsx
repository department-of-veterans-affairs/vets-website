import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { makeSelectError, makeSelectApp } from '../selectors';

import { useFormRouting } from '../hooks/useFormRouting';

import { APP_NAMES } from '../utils/appConstants';

export const withError = Component => {
  const WrappedComponent = props => {
    const selectError = useMemo(makeSelectError, []);
    const { error } = useSelector(selectError);

    const selectApp = useMemo(makeSelectApp, []);
    const { app } = useSelector(selectApp);

    const { router } = props;

    const { goToErrorPage } = useFormRouting(router);

    useEffect(
      () => {
        if (
          error ===
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-upcoming-appointments`
        ) {
          return;
        }
        if (error) {
          goToErrorPage(error);
        }
      },
      [error, goToErrorPage, app],
    );
    // Allowing for HOC
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} />;
  };

  WrappedComponent.propTypes = {
    router: propTypes.object,
  };

  return WrappedComponent;
};
