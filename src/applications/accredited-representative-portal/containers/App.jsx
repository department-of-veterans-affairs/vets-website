import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { fetchUser } from '../actions/user';
import { selectUserIsLoading } from '../selectors/user';
import Footer from '../components/common/Footer/Footer';
import Header from '../components/common/Header/Header';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserIsLoading);

  useEffect(
    () => {
      dispatch(fetchUser());
    },
    [dispatch],
  );

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const isAppToggleLoading = useToggleLoadingValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );

  const isAppEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );

  const isProduction = window.Cypress || environment.isProduction();

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (isProduction && !isAppEnabled) {
    document.location.replace('/');
    return null;
  }

  return (
    <>
      <Header />
      {isLoading ? (
        <VaLoadingIndicator message="Loading user information..." />
      ) : (
        <Outlet />
      )}
      <Footer />
    </>
  );
};

export default App;
