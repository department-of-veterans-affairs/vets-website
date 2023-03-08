import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import AutoSSO from '@department-of-veterans-affairs/platform-site-wide/AutoSSO';
import LoginContainer from '@department-of-veterans-affairs/platform-user/LoginContainer';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { signInServiceEnabled } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import {
  externalApplicationsConfig,
  OAuthEnabledApplications,
} from '@department-of-veterans-affairs/platform-user/exports';

export function UnifiedSigninPage({ router, location }) {
  const isAuthenticated = useSelector(state => isLoggedIn(state));
  const isSiSEnabled = useSelector(state => signInServiceEnabled(state));
  const { query } = location;
  const loggedOut = query?.auth === 'logged_out';
  const externalApplication = query.application;

  const { OAuthEnabled } =
    externalApplicationsConfig[externalApplication] ??
    externalApplicationsConfig.default;
  const isQueryAlreadySet = ['true', 'false'].includes(query?.oauth);

  // Check if authenticated and redirect if necessary
  useEffect(() => {
    if (isAuthenticated) {
      window.location = '/';
    }
  }, []);

  // Immediately check if OAuthEnabled
  useEffect(
    () => {
      if (
        isAuthenticated ||
        (isQueryAlreadySet &&
          OAuthEnabledApplications.includes(externalApplication))
      ) {
        return;
      }

      router.push(
        appendQuery(
          '',
          { ...query, oauth: isSiSEnabled && OAuthEnabled },
          { removeNull: true },
        ),
      );
    },
    [isSiSEnabled],
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
