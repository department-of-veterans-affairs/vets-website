import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectCurrentContext } from '../selectors';
import { useFormRouting } from '../hooks/useFormRouting';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { URLS } from '../utils/navigation';
import { SCOPES } from '../../utils/token-format-validator';

const withAuthorization = Component => {
  return props => {
    const { router } = props;
    const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
    const { token, permissions } = useSelector(selectCurrentContext);

    const { jumpToPage, goToErrorPage } = useFormRouting(router);
    const { getCurrentToken } = useSessionStorage();

    useEffect(
      () => {
        if (!token) {
          // no Token
          // check session storage
          const sessionToken = getCurrentToken(window)?.token;
          if (!sessionToken) {
            // no session token
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
        <Component {...props} />
      </>
    );
  };
};

export default withAuthorization;
