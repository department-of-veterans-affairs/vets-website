import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import AuthorizedRoutes from './AuthorizedRoutes';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';
import ScrollToTop from '../components/shared/ScrollToTop';

import { useDatadogRum } from '../hooks/useDatadogRum';

const App = () => {
  const user = useSelector(selectUser);
  const { featureTogglesLoading, appEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingToVaGovRelease
          ],
      };
    },
    state => state.featureToggles,
  );

  useDatadogRum();

  if (featureTogglesLoading) {
    return (
      <div className="vads-l-grid-container">
        <va-loading-indicator
          message="Loading your secure messages..."
          setFocus
          data-testid="feature-flag-loading-indicator"
        />
      </div>
    );
  }

  /* if the user is not whitelisted or feature flag is disabled, redirect to the SM info page */
  if (!appEnabled) {
    window.location.replace('/health-care/secure-messaging');
    return <></>;
  }
  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MESSAGING]}
    >
      <div className="vads-l-grid-container">
        <SmBreadcrumbs />
        <div className="secure-messaging-container vads-u-display--flex">
          <Navigation />
          <ScrollToTop />
          <Switch>
            <AuthorizedRoutes />
          </Switch>
        </div>
        <div className="bottom-container">
          <va-back-to-top />
        </div>
      </div>
    </RequiredLoginView>
  );
};

export default App;
