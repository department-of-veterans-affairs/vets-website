import React from 'react';
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

  if (isFormAvailable === false) {
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

export default connect(mapStateToProps)(App);
