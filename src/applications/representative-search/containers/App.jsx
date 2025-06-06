import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { useBrowserMonitoring } from '../hooks/useBrowserMonitoring';

function App({ children }) {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  // Use Datadog Real User Monitoring (RUM)
  useBrowserMonitoring();

  const appEnabled = useToggleValue(
    TOGGLE_NAMES.findARepresentativeEnableFrontend,
  );

  const togglesLoading = useToggleLoadingValue();

  if (togglesLoading) {
    return (
      <>
        <div className="find-a-representative vads-u-margin-x--3">
          <VaLoadingIndicator />
        </div>
      </>
    );
  }

  if (!appEnabled && environment.isProduction()) {
    return document.location.replace('/');
  }

  return (
    <>
      <div className="find-a-representative">{children}</div>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedResult: state.searchResult.selectedResult,
    searchQuery: state.searchQuery,
    results: state.searchResult.results,
  };
}

export default connect(
  mapStateToProps,
  null,
)(App);
