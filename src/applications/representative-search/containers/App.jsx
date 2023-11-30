import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import GetFormHelp from '../components/GetFormHelp';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

function App({ children }) {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const appEnabled = useToggleValue(TOGGLE_NAMES.findARepresentative);
  const isProduction = environment.isProduction();

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

  if (!appEnabled && isProduction) {
    return document.location.replace('/');
  }

  return (
    <>
      <div className="find-a-representative vads-u-margin-x--3">
        <div className="row">{children}</div>
        <div className="row">
          <div className="usa-grid usa-width-three-fourths">
            <GetFormHelp />
          </div>
        </div>
      </div>
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
