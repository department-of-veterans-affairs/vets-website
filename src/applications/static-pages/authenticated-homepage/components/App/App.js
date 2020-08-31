// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectShowAuthenticatedHomepage } from 'applications/static-pages/authenticated-homepage/selectors';
import environment from 'platform/utilities/environment';

export const App = ({ showAuthHomePage }) => {
  const homepage = document.getElementById('homepage');

  if (environment.isProduction() || !showAuthHomePage || !homepage) {
    return null;
  }

  homepage.style.display = 'none';
  return <div>This is authenticated homepage extreme!</div>;
};

App.propTypes = {
  showAuthHomePage: PropTypes.bool,
};

const mapStateToProps = state => {
  const loggedIn = state.user.login.currentlyLoggedIn;
  const authHomepageFeatureFlag = selectShowAuthenticatedHomepage(state);
  const authHomepageLocalStorage = localStorage.getItem(
    'AUTHENTICATED_HOMEPAGE',
  );
  // This value exists to override the feature flag when it's on
  const noAuthHomepage = localStorage.getItem('NO_AUTHENTICATED_HOMEPAGE');

  // Show auth homepage when
  // 1) the user is logged in
  // 2) not in production environment
  // 3) the feature flag is turned on OR
  // 4) AUTHENTICATED_HOMEPAGE in localStorage is true

  // Don't show auth homepage when
  // 1) NO_AUTHENTICATED_HOMEPAGE in localStorage is true
  // 2) Neither the feature flag or localStorage value AUTHENTICATED_HOMEPAGE is true
  return {
    showAuthHomePage:
      loggedIn &&
      (authHomepageFeatureFlag || authHomepageLocalStorage === "true") &&
      !noAuthHomepage,
  };
};

export default connect(
  mapStateToProps,
  null,
)(App);
