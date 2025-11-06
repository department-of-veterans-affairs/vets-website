import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import formConfig from '../config/form';
import { WIP } from '../../shared/components/WIP';

function App({ location, children, showForm, isLoading }) {
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
    return <WIP />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <DowntimeNotification
        appTitle="veteran's application for increase compensation based on unemployability"
        dependencies={[externalServices.lighthouseBenefitsIntake]}
      >
        {children}
      </DowntimeNotification>
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
    toggleValues(state)[FEATURE_FLAG_NAMES.form218940] ||
    environment.isLocalhost(),
});

export default connect(mapStateToProps)(App);
