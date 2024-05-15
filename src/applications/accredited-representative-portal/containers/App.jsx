import React, { useEffect } from 'react';
import { connect, useDispatch, Provider } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { fetchUser } from '../actions/user';
import createReduxStore from '../store';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';

const store = createReduxStore();

function App({ user }) {
  const dispatch = useDispatch();
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

  const isProduction = environment.isProduction();

  if (isAppToggleLoading) {
    return (
      <div className="vads-u-margin-y--5">
        <VaLoadingIndicator message="Loading the Accredited Representative Portal..." />
      </div>
    );
  }

  if (isProduction && !isAppEnabled) {
    return document.location.replace('/');
  }

  return (
    <Provider store={store}>
      <>
        <Header isSignedIn={!!user} />
        <Outlet />
        <Footer />
      </>
    </Provider>
  );
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps)(App);
