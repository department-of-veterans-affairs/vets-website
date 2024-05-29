import ENVIRONMENTS from 'site/constants/environments';
import React, { useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { fetchUser } from '../actions/user';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const selectUserProfile = state => state.user?.profile;
const selectUserIsLoading = state => state.user?.isLoading;

function App() {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
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

  const isAppToggleLoading = useToggleLoadingValue();
  const isAppEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );
  const getBuildType = () => {
    return localStorage.getItem('overrideBuildType') || __BUILDTYPE__;
  };

  const isProduction = () => {
    return getBuildType() === ENVIRONMENTS.VAGOVPROD;
  };

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
      <Header isSignedIn={!!profile} />
      {isLoading ? (
        <VaLoadingIndicator message="Loading user information (App)..." />
      ) : (
        <Outlet />
      )}
      <Footer />
    </>
  );
}

export default App;
