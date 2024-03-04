import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

function App({ children }) {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const appEnabled = useToggleValue(TOGGLE_NAMES.representativesPortalFrontend);

  const toggleIsLoading = useToggleLoadingValue();

  if (toggleIsLoading) {
    return (
      <div className="vads-u-margin-x--3">
        <VaLoadingIndicator />
      </div>
    );
  }

  if (!appEnabled) {
    return document.location.replace('/');
  }

  return <>{children}</>;
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
