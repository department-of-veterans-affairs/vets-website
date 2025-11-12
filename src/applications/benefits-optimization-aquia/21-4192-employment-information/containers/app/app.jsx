import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import formConfig from '@bio-aquia/21-4192-employment-information/config/form';

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
 * Main application container component for VA Form 21-4192
 * This component is guarded by a feature flag.
 *
 * @module containers/app
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child route components
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
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form4192Enabled],
});

export default connect(mapStateToProps)(App);
