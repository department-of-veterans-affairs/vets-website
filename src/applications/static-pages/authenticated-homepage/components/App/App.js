// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectShowAuthenticatedHomepage } from 'applications/static-pages/authenticated-homepage/selectors';
import environment from 'platform/utilities/environment';

export const App = ({ showAuthHomePage }) => {
  if (environment.isProduction) {
    return null;
  }

  if (!showAuthHomePage) {
    return null;
  }

  document.getElementById('homepage').style.display = 'none';
  return <div>This is authenticated homepage extreme!</div>;
};

App.propTypes = {
  showAuthHomePage: PropTypes.bool,
};

const mapStateToProps = state => {
  const loggedIn = state.user.login.currentlyLoggedIn;
  const authHomepageFF = selectShowAuthenticatedHomepage(state);
  const authHomepageLS = localStorage.getItem('AUTHENTICATED_HOMEPAGE');
  const noAuthHomepage = localStorage.getItem('NO_AUTHENTICATED_HOMEPAGE');

  return {
    showAuthHomePage:
      loggedIn && (authHomepageFF || authHomepageLS) && !noAuthHomepage,
  };
};

export default connect(
  mapStateToProps,
  null,
)(App);
