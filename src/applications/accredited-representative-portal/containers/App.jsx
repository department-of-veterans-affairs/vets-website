import React from 'react';
import { Outlet } from 'react-router-dom';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Header from '../components/Header';
import Footer from '../components/Footer';

function App() {
  const {
    TOGGLE_NAMES: { accreditedRepresentativePortalFrontend: appToggleKey },
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isAppToggleLoading = useToggleLoadingValue(appToggleKey);

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
