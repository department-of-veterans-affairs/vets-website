import React from 'react';
import { useSelector } from 'react-redux';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';

import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export default function App() {
  const user = useSelector(selectUser);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const useNewVersion = useToggleValue(
    TOGGLE_NAMES.defaultRoutingUseNewVersion,
  );

  return (
    <>
      <h1>Default Routing App</h1>
      <RequiredLoginView
        serviceRequired={[backendServices.USER_PROFILE]}
        user={user}
        showProfileErrorMessage
      >
        <DowntimeNotification
          appTitle="Default Routing App"
          dependencies={[externalServices.mhvPlatform]}
        >
          {useNewVersion ? (
            <div>If you can see this, the app is using the new version.</div>
          ) : (
            <div>If you can see this, the app is using the old version.</div>
          )}
        </DowntimeNotification>
      </RequiredLoginView>
    </>
  );
}
