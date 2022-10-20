import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import AutoSSO from 'platform/site-wide/user-nav/containers/AutoSSO';
import LoginContainer from 'platform/user/authentication/components/LoginContainer';
import { isLoggedIn } from 'platform/user/selectors';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';

export function UnifiedSigninPage({ router, location }) {
  const useSignInService = useSelector(state => signInServiceEnabled(state));
  const isAuthenticated = useSelector(state => isLoggedIn(state));
  const { query } = location;
  const loggedOut = query?.auth === 'logged_out';
  const externalApplication = query.application;
  const { OAuthEnabled } = externalApplication
    ? externalApplicationsConfig[externalApplication]
    : externalApplicationsConfig.default;

  useEffect(
    () => {
      if (isAuthenticated) {
        window.location = '/';
      }
    },
    [isAuthenticated],
  );

  // immediately add oauth=true on component mount
  useEffect(
    () => {
      // check if oauth=false, leave it alone
      if (query?.oauth === 'false') {
        return;
      }

      const url = appendQuery(
        '',
        {
          ...query,
          oauth: OAuthEnabled && useSignInService ? 'true' : 'false',
        },
        { removeNull: true },
      );

      router.push(url);
    },
    [query, OAuthEnabled, useSignInService, router],
  );

  return (
    <>
      <AutoSSO />
      <LoginContainer
        isUnifiedSignIn
        externalApplication={externalApplication}
        loggedOut={loggedOut}
      />
    </>
  );
}

UnifiedSigninPage.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
};

export default UnifiedSigninPage;
