import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import NoRegistrationMessage from './NoRegistrationMessage';
import VAOSApp from './VAOSApp';
import ErrorBoundary from './ErrorBoundary';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const hasRegisteredSystems = sites?.length > 0;
  return (
    <ErrorBoundary fullWidth>
      <VAOSApp>
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
      </VAOSApp>
    </ErrorBoundary>
  );
}

EnrolledRoute.propTypes = {
  component: PropTypes.func,
};
