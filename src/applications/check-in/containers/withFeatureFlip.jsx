import React from 'react';

const withFeatureFlip = WrappedComponent => {
  return props => {
    return <WrappedComponent {...props} />;
  };
};

export { withFeatureFlip };

/* import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const App = ({ isCheckInEnabled, isLoadingFeatureFlags, children }) => {
  if (isLoadingFeatureFlags) {
    return (
      <>
        <LoadingIndicator />
      </>
    );
  } else if (!isCheckInEnabled) {
    window.location.replace('/');
    return <></>;
  } else {
    return (
      <>
        <meta name="robots" content="noindex" />
        {children}
      </>
    );
  }
};

const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
});

export default connect(mapStateToProps)(App);
*/
