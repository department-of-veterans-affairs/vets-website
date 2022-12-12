import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { makeSelectError } from '../selectors';

import { useFormRouting } from '../hooks/useFormRouting';

export const withError = Component => {
  const WrappedComponent = props => {
    const selectError = useMemo(makeSelectError, []);
    const { error } = useSelector(selectError);

    const { router } = props;

    const { goToErrorPage } = useFormRouting(router);

    useEffect(
      () => {
        if (error) {
          goToErrorPage(error);
        }
      },
      [error, goToErrorPage],
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
