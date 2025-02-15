import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser } from 'platform/user/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { selectAuthStatus } from '../redux/selectors';
import { useDatadogRum } from '../utils/useDatadogRum';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const { isUserLOA3 } = useSelector(selectAuthStatus);

  const hasRegisteredSystems = sites?.length > 0;
  useDatadogRum();

  if (!user.profile.verified || !isUserLOA3 || !hasRegisteredSystems) {
    // Using this approach to redirect since 'basename' is set to 'appointments'
    // for the router.
    // Ex. (!hasRegisteredSystems || !isUserLOA3) && ( <Redirect to={{ pathname: '/my-health' }} /> )
    // results in: http://localhost:3001/my-health/appointments/my-health
    window.location.replace(`/my-health`);
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
        {/* TODO: Delete 'NoRegistrationMessage' component after code review confirmed */}
        {/* {!hasRegisteredSystems && <NoRegistrationMessage />} */}
        {hasRegisteredSystems && <RouteComponent />}
      </Route>
    </RequiredLoginView>
  );
}
