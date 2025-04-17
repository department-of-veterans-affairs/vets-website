import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser, isLOA3 } from 'platform/user/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDatadogRum } from '../utils/useDatadogRum';
import { selectFeatureMhvRouteGuards } from '../redux/selectors';
import NoRegistrationMessage from './NoRegistrationMessage';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const featureMhvRouteGuards = useSelector(selectFeatureMhvRouteGuards);
  const isUserLOA3 = useSelector(isLOA3);
  const hasRegisteredSystems = sites?.length > 0;

  useDatadogRum();

  // Helper function to determine if the user should be redirected to the `/my-health` page.
  // This is based on the following conditions:
  // 1. The `featureMhvRouteGuards` flag is enabled.
  // 2. The user is either not LOA3 authenticated or not registered with any facilities.
  const shouldRedirectToMyHealtheVet = () =>
    featureMhvRouteGuards && (!isUserLOA3 || !hasRegisteredSystems);

  // Redirect the user to `/my-health` if necessary
  if (shouldRedirectToMyHealtheVet()) {
    window.location.replace(`/my-health`);
    return null; // Prevent further rendering
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
      <Route {...rest}>
        {!featureMhvRouteGuards && !hasRegisteredSystems && (
          <NoRegistrationMessage />
        )}
        {hasRegisteredSystems && <RouteComponent />}
      </Route>
    </RequiredLoginView>
  );
}
EnrolledRoute.propTypes = {
  component: PropTypes.func,
};
