import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import * as userSelectors from 'platform/user/selectors';

function Layout({ formIsEnabled, isProfileLoading, children }) {
  if (formIsEnabled) {
    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <div className="vads-l-row">
          {isProfileLoading ? (
            <va-loading-indicator message="Loading your profile..." />
          ) : (
            <div className="vads-l-col--12 large-screen:vads-l-col--8">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (formIsEnabled === false) {
    window.location.replace('/health-care/covid-19-vaccine/');
  }

  return <va-loading-indicator message="Loading the application..." />;
}

const mapStateToProps = state => {
  return {
    isProfileLoading: userSelectors.isProfileLoading(state),
    formIsEnabled: toggleValues(state)[
      FEATURE_FLAG_NAMES.covidVaccineUpdatesForm
    ],
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layout);
export { Layout };
