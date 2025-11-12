/**
 * @module containers/app
 * @description Main application container for VA Form 21-2680
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

/**
 * Component displayed when the form is not available due to feature flag
 * @returns {React.ReactElement} Not available message
 */
const FormNotAvailable = () => (
  <div className="vads-l-grid-container vads-u-padding-y--5">
    <h1>This form isn’t available right now</h1>
    <p>We’re sorry. This form isn’t available at this time.</p>
    <a href="/" className="vads-c-action-link--blue">
      Go back to VA.gov
    </a>
  </div>
);

/**
 * Root application component for VA Form 21-2680
 *
 * Wraps the form with RoutedSavableApp to provide save-in-progress functionality,
 * auto-save on navigation, form state management, and session timeout handling.
 * This component is guarded by a feature flag.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child route components (form pages)
 * @param {Object} props.location - React Router location object
 * @param {boolean} props.formEnabled - Feature flag indicating if form is enabled
 */
export const App = ({ location, children, formEnabled }) => {
  // Show loading indicator while feature flag is being fetched
  if (formEnabled === undefined) {
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator message="Loading..." />
      </div>
    );
  }

  // Show not available message if flag is false
  if (!formEnabled) {
    return <FormNotAvailable />;
  }

  // Render normal app if flag is true
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  children: PropTypes.node,
  formEnabled: PropTypes.bool,
  location: PropTypes.object,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form2680Enabled],
});

export default connect(mapStateToProps)(App);
