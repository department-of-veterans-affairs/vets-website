// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import Header from '../Header';
import LegacyHeader from '../LegacyHeader';

export const App = ({ show, showHeaderV2, showMegaMenu, showNavLogin }) => {
  // Do not render if prop show is falsey.
  if (!show) {
    return null;
  }

  // Render the legacy header if the feature toggle is not enabled.
  if (!showHeaderV2) {
    return (
      <LegacyHeader showMegaMenu={showMegaMenu} showNavLogin={showNavLogin} />
    );
  }

  return <Header />;
};

App.propTypes = {
  show: PropTypes.bool.isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
  // From mapStateToProps.
  showHeaderV2: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showHeaderV2: state?.featureToggles?.showHeaderV2,
});

export default connect(
  mapStateToProps,
  null,
)(App);
