import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors.js';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser } from 'platform/user/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { useDatadogRum } from '../utils/useDatadogRum';
import NoRegistrationMessage from './NoRegistrationMessage';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const hasRegisteredSystems = sites?.length > 0;
  useDatadogRum();
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
        {!hasRegisteredSystems && <NoRegistrationMessage />}
        {hasRegisteredSystems && <RouteComponent />}
      </Route>
    </RequiredLoginView>
  );
}
