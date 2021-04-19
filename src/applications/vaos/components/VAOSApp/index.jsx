import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { selectUser, selectPatientFacilities } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';

import {
  selectFeatureApplication,
  selectFeatureToggleLoading,
  selectUseFlatFacilityPage,
} from '../../redux/selectors';
import NoRegistrationMessage from './NoRegistrationMessage';
import AppUnavailable from './AppUnavailable';
import DowntimeMessage from './DowntimeMessage';
import FullWidthLayout from '../FullWidthLayout';
import { captureError } from '../../utils/error';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: captureError,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function VAOSApp({
  user,
  children,
  showApplication,
  loadingFeatureToggles,
  sites,
  useFlatFacilityPage,
}) {
  useEffect(
    () => {
      if (useFlatFacilityPage) {
        recordEvent({
          event: 'phased-roll-out-enabled',
          'product-description': 'VAOS - Facility Selection v2',
        });
      }
    },
    [useFlatFacilityPage],
  );
  const hasRegisteredSystems = sites?.length > 0;

  return (
    <RequiredLoginView
      serviceRequired={[
        backendServices.USER_PROFILE,
        backendServices.FACILITIES,
      ]}
      user={user}
      verify={!environment.isLocalhost()}
    >
      <QueryClientProvider client={queryClient}>
        {loadingFeatureToggles && (
          <FullWidthLayout>
            <LoadingIndicator />
          </FullWidthLayout>
        )}
        {!loadingFeatureToggles &&
          showApplication && (
            <DowntimeNotification
              appTitle="VA online scheduling tool"
              dependencies={[externalServices.mvi, externalServices.vaos]}
              render={(props, childContent) => (
                <DowntimeMessage {...props}>{childContent}</DowntimeMessage>
              )}
            >
              {!hasRegisteredSystems && <NoRegistrationMessage />}
              {hasRegisteredSystems && children}
            </DowntimeNotification>
          )}
        {!loadingFeatureToggles && !showApplication && <AppUnavailable />}
      </QueryClientProvider>
    </RequiredLoginView>
  );
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    showApplication: selectFeatureApplication(state),
    loadingFeatureToggles: selectFeatureToggleLoading(state),
    sites: selectPatientFacilities(state),
    useFlatFacilityPage: selectUseFlatFacilityPage(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
