import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import manifest from '../manifest.json';
import formConfig from '../config/form';

function App({ location, children, isLoggedIn, formData }) {
  const isIntroPage = location.pathname === '/introduction';
  const noSaveInProgressData = !formData?.ssn;

  // Redirect to introduction page if not logged in or no ssn
  if (!isIntroPage && (!isLoggedIn || (isLoggedIn && noSaveInProgressData))) {
    document.location.replace(manifest.rootUrl);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user?.login?.currentlyLoggedIn,
    formData: state.form?.data || {},
    state,
  };
};

App.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  loadedData: PropTypes.object,
  location: PropTypes.object,
};

export default connect(mapStateToProps)(App);
