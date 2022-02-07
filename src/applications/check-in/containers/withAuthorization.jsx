import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { makeSelectCurrentContext } from '../selectors';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { useFormRouting } from '../hooks/useFormRouting';

import { SCOPES } from '../utils/token-format-validator';
import { URLS } from '../utils/navigation';

const withAuthorization = (Component, options) => {
  const WrappedComponent = props => {
    const { isPreCheckIn } = options;
    const { router } = props;
    const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
    const { token, permissions } = useSelector(selectCurrentContext);

    const { jumpToPage, goToErrorPage } = useFormRouting(router);
    const { getCurrentToken } = useSessionStorage(isPreCheckIn);

    useEffect(
      () => {
        if (!token) {
          const sessionToken = getCurrentToken(window)?.token;
          if (!sessionToken) {
            // @TODO: Add a friendlier message when the UUID is not found
            goToErrorPage();
          } else {
            jumpToPage(URLS.LANDING, { params: { url: { id: sessionToken } } });
          }
        } else if (permissions !== SCOPES.READ_FULL) {
          jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
        }
      },
      [token, permissions, getCurrentToken, goToErrorPage, jumpToPage],
    );

    return (
      <>
        {/* Allowing for HOC */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
      </>
    );
  };

  WrappedComponent.propTypes = {
    router: propTypes.object,
  };

  return WrappedComponent;
};

export default withAuthorization;
