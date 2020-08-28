import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { selectUser, selectPatientFacilities } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';

import {
  vaosApplication,
  selectFeatureToggleLoading,
} from '../utils/selectors';
import NoRegistrationMessage from '../components/NoRegistrationMessage';
import AppUnavailable from '../components/AppUnavailable';
import DowntimeMessage from '../components/DowntimeMessage';
import FullWidthLayout from '../components/FullWidthLayout';

function VAOSApp({
  user,
  children,
  showApplication,
  loadingFeatureToggles,
  sites,
}) {
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
    </RequiredLoginView>
  );
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    showApplication: vaosApplication(state),
    loadingFeatureToggles: selectFeatureToggleLoading(state),
    sites: selectPatientFacilities(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
