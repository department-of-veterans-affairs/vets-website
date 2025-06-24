import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser, isLOA3 } from 'platform/user/selectors';
import FullWidthLayout from './FullWidthLayout';

import { useDatadogRum } from '../utils/useDatadogRum';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const isUserLOA3 = useSelector(isLOA3);
  const hasRegisteredSystems = sites?.length > 0;
  const isToggleLoading = useSelector(state => state.featureToggles.loading);
  const userProfileLoading = user?.profile?.loading;
  useDatadogRum();

  // Wait for feature flag & user profile to load before rendering.
  if (isToggleLoading || userProfileLoading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator
          set-focus
          message="Checking your information..."
        />
      </FullWidthLayout>
    );
  }

  // Determine if the user should be redirected to the `/my-health` page.
  // Redirect if:
  //   1. The user is not LOA3 authenticated
  //   2. OR not registered with any facilities.
  const shouldRedirectToMyHealtheVet = !isUserLOA3 || !hasRegisteredSystems;

  if (shouldRedirectToMyHealtheVet) {
    window.location.replace(`${window.location.origin}/my-health`);
    return null;
  }

  return (
    <RequiredLoginView
      serviceRequired={[
        backendServices.USER_PROFILE,
        backendServices.FACILITIES,
      ]}
      user={user}
      verify={!environment.isLocalhost()}
    >
      <Route {...rest}>{hasRegisteredSystems && <RouteComponent />}</Route>
    </RequiredLoginView>
  );
}
EnrolledRoute.propTypes = {
  component: PropTypes.func,
};
