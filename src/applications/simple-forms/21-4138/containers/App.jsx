import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import { initializeProfile } from 'platform/user/profile/actions';
import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';
import { workInProgressContent } from '../config/constants';

function App({ location, children, showForm, isLoading }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeProfile());
    localStorage.setItem('hasSession', true);
  }, []);

  if (isLoading) {
    return (
      <va-loading-indicator
        message="Please wait while we load the application for you."
        class="vads-u-margin-y--4"
        set-focus
      />
    );
  }
  if (!showForm) {
    return <WIP content={workInProgressContent} />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  showForm: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoading: state?.featureToggles?.loading,
  showForm:
    toggleValues(state)[FEATURE_FLAG_NAMES.form214138] ||
    environment.isLocalhost(),
});

export default connect(mapStateToProps)(App);
