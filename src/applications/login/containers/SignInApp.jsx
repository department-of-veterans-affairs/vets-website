import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import LoginContainer from 'platform/user/authentication/components/LoginContainer';
import { isLoggedIn } from 'platform/user/selectors';
import { signInServiceEnabled } from 'platform/user/authentication/selectors';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { OAuthEnabledApplications } from 'platform/user/authentication/config/constants';

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

  const css = `
  #desktop-header > div:nth-child(3) > div.menu-rule.usa-one-whole,   div .profile-nav-container, .menu-rule.usa-one-whole,  .hidden-header {
    visibility:hidden;
  }
`;

  return (
    <>
      <style>{css}</style>
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
