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
  const appEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalFrontend,
  );
  const toggleIsLoading = useToggleLoadingValue();

  if (toggleIsLoading) {
    return (
      <div className="vads-u-margin-x--3">
        <VaLoadingIndicator />
      </div>
    );
  }

  if (!appEnabled && environment.isProduction()) {
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
