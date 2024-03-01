import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { makeSelectCurrentContext } from '../selectors';

import { useStorage } from '../hooks/useStorage';
import { useFormRouting } from '../hooks/useFormRouting';

import { SCOPES } from '../utils/token-format-validator';
import { URLS } from '../utils/navigation';
import { useUpdateError } from '../hooks/useUpdateError';

const withAuthorization = (Component, options) => {
  const WrappedComponent = props => {
    const { appName } = options;
    const { router } = props;
    const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
    const { token, permissions } = useSelector(selectCurrentContext);

    const { jumpToPage } = useFormRouting(router);
    const { getCurrentToken } = useStorage(appName);
    const { updateError } = useUpdateError();

    useEffect(
      () => {
        if (!token) {
          const sessionToken = getCurrentToken(window)?.token;
          if (!sessionToken) {
            updateError('no-token');
          } else {
            jumpToPage(URLS.LANDING, { params: { url: { id: sessionToken } } });
          }
        } else if (permissions !== SCOPES.READ_FULL) {
          jumpToPage(URLS.LANDING, { params: { url: { id: token } } });
        }
      },
      [token, permissions, getCurrentToken, updateError, jumpToPage],
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
