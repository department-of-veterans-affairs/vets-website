import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Dashboard from '../components/Dashboard';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

function App({ user }) {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const appEnabled = useToggleValue(TOGGLE_NAMES.representativesPortalFrontend);

  const toggleIsLoading = useToggleLoadingValue();

  if (toggleIsLoading) {
    return <VaLoadingIndicator />;
  }

  if (!appEnabled && environment.isProduction()) {
    return document.location.replace('/');
  }

  return (
    <RequiredLoginView
      // TODO: Determine the significance of this flag for us.
      verify
      // TODO: Determine which services we require.
      serviceRequired={[]}
      user={user}
    >
      <div>
        <Dashboard />
      </div>
    </RequiredLoginView>
  );
}

App.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object,
};

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
export { App };
