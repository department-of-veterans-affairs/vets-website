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

export default function App({ children }) {
  const user = useSelector(selectUser);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const useNewVersion = useToggleValue(
    TOGGLE_NAMES.defaultRoutingUseNewVersion,
  );

  return (
    <>
      <RequiredLoginView
        serviceRequired={[backendServices.USER_PROFILE]}
        user={user}
        showProfileErrorMessage
      >
        <DowntimeNotification
          appTitle="Default Routing App"
          dependencies={[externalServices.mhvPlatform]}
        >
          <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0 main-content">
            {useNewVersion ? (
              <va-alert>
                If you can see this, the app is using the new version.
              </va-alert>
            ) : (
              <va-alert>
                If you can see this, the app is using the old version.
              </va-alert>
            )}
            {children}
          </div>
        </DowntimeNotification>
      </RequiredLoginView>
    </>
  );
}
