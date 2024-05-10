import React from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';

function App() {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isAppEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );
  const isAppToggleLoading = useToggleLoadingValue();

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (environment.isProduction() && !isAppEnabled) {
    return document.location.replace('/');
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
