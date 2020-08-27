// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectShowAuthenticatedHomepage } from 'applications/static-pages/authenticated-homepage/selectors';

export const App = ({ showAuthHomePage }) => {
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

  return {
    showAuthHomePage: loggedIn && (authHomepageFF || authHomepageLS),
  };
};

export default connect(
  mapStateToProps,
  null,
)(App);
