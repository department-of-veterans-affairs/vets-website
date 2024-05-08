import React from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

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

  const isInPilot = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalPilot,
  );

  const toggleIsLoading = useToggleLoadingValue();

  if (toggleIsLoading) {
    return (
      <div className="vads-u-margin-x--3">
        <VaLoadingIndicator />
      </div>
    );
  }

  if (!isInPilot) {
    return (
      <>
        <Header />
        <div className="vads-u-margin--9">
          <h1 data-testid="not-in-pilot-heading">
            Accredited Representative Portal is currently in pilot and not
            available to all users.
          </h1>
        </div>
        <Footer />
      </>
    );
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
