import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';
import { fetchUser } from '../actions/user';
import { selectIsUserLoading } from '../selectors/user';

const App = () => {
  const {
    TOGGLE_NAMES: { accreditedRepresentativePortalFrontend: appToggleKey },
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();

  const isAppEnabled = useToggleValue(appToggleKey);
  const isProduction = window.Cypress || environment.isProduction();
  const shouldExitApp = isProduction && !isAppEnabled;

  const isAppToggleLoading = useToggleLoadingValue(appToggleKey);
  const isUserLoading = useSelector(selectIsUserLoading);

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUser()), [dispatch]);

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (shouldExitApp) {
    window.location.replace('/');
    return null;
  }

  const content = isUserLoading ? (
    <VaLoadingIndicator message="Loading user information..." />
  ) : (
    <Outlet />
  );

  return (
    <div className="container">
      <Header />
      {content}
      <Footer />
    </div>
  );
};

export default App;
