import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

const App = ({ loading, isFormAvailable, location, children }) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isFormAvailable) {
    return document.location.replace('/');
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

const mapStateToProps = state => ({
  loading: toggleValues(state).loading,
  isFormAvailable: toggleValues(state)[
    FEATURE_FLAG_NAMES.allowOnline1010cgSubmissions
  ],
});

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  isFormAvailable: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
