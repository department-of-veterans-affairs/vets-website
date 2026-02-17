import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import LoginContainer from 'platform/user/authentication/components/LoginContainer';
import { isLoggedIn } from 'platform/user/selectors';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { OAuthEnabledApplications } from 'platform/user/authentication/config/constants';
import { signInAppCSS } from '../constants';

export function UnifiedSigninPage({ router, location }) {
  const isAuthenticated = useSelector(state => isLoggedIn(state));
  const { query } = location;
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

    document.title = `Sign in or create an account | Veterans Affairs`;
  }, []);

  // Immediately check if OAuthEnabled
  useEffect(() => {
    if (
      isAuthenticated ||
      (isQueryAlreadySet &&
        OAuthEnabledApplications.includes(externalApplication))
    ) {
      return;
    }

    router.push(
      appendQuery('', { ...query, oauth: OAuthEnabled }, { removeNull: true }),
    );
  }, []);

  return (
    <>
      <style>{signInAppCSS}</style>
      <LoginContainer
        isUnifiedSignIn
        externalApplication={externalApplication}
      />
    </>
  );
}

UnifiedSigninPage.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
};

export default UnifiedSigninPage;
