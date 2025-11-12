import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SaveInProgress } from '@bio-aquia/shared/components';

import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

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
 * Main application component for VA Form 21P-530A Interment Allowance.
 * The RoutedSavableApp component handles all save-in-progress and prefill functionality.
 * This component is guarded by a feature flag.
 *
 * @param {Object} props - Component props
 * @param {Object} props.location - React router location object
 * @param {Object} props.router - React router instance
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.formEnabled - Feature flag indicating if form is enabled
 * @returns {React.ReactElement} The application container component
 */
export const App = ({ location, router, children, formEnabled }) => {
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
    <SaveInProgress formConfig={formConfig} location={location} router={router}>
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <RoutedSavableApp
          formConfig={formConfig}
          currentLocation={location}
          router={router}
        >
          {children}
        </RoutedSavableApp>
      </div>
    </SaveInProgress>
  );
};

App.propTypes = {
  children: PropTypes.node,
  formEnabled: PropTypes.bool,
  location: PropTypes.object,
  router: PropTypes.object,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form530aEnabled],
});

export default connect(mapStateToProps)(App);
