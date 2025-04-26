import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { selectPatientFacilities } from 'platform/user/cerner-dsot/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser, isLOA3 } from 'platform/user/selectors';

import { useDatadogRum } from '../utils/useDatadogRum';
import { selectFeatureMhvRouteGuards } from '../redux/selectors';
import NoRegistrationMessage from './NoRegistrationMessage';

export default function EnrolledRoute({ component: RouteComponent, ...rest }) {
  const user = useSelector(selectUser);
  const sites = useSelector(selectPatientFacilities);
  const featureMhvRouteGuards = useSelector(selectFeatureMhvRouteGuards);
  const isUserLOA3 = useSelector(isLOA3);
  const hasRegisteredSystems = sites?.length > 0;
  const featureTogglesLoading = useSelector(
    state => state.featureToggles?.loading,
  );

  // Adding logs to debug values in staging. Redirect is working loaclly but not in staging.
  if (!environment.isProduction() || !navigator.userAgent === 'node.js') {
    /* eslint-disable no-console */
    console.log('----');
    console.log('initialRender:');
    console.log('featureMhvRouteGuards:', featureMhvRouteGuards);
    console.log('isUserLOA3:', isUserLOA3);
    console.log('hasRegisteredSystems:', hasRegisteredSystems);
    console.log('featureTogglesLoading:', featureTogglesLoading);
    console.log('----');
  }

  useDatadogRum();

  // Wait for feature flag to load before rendering.
  if (featureTogglesLoading) {
    return null;
  }

  // Determine if the user should be redirected to the `/my-health` page.
  // Redirect if:
  //   1. The `featureMhvRouteGuards` flag is enabled,
  //   2. AND the user is either not LOA3 authenticated OR not registered with any facilities.
  const shouldRedirectToMyHealtheVet = () =>
    featureMhvRouteGuards && (!isUserLOA3 || !hasRegisteredSystems);

  if (shouldRedirectToMyHealtheVet()) {
    if (!environment.isProduction() || !navigator.userAgent === 'node.js') {
      /* eslint-disable no-console */
      console.log('----');
      console.log('shouldRedirectToMyHealtheVet if statement');
      console.log('featureMhvRouteGuards:', featureMhvRouteGuards);
      console.log('isUserLOA3:', isUserLOA3);
      console.log('hasRegisteredSystems:', hasRegisteredSystems);
      console.log('featureTogglesLoading:', featureTogglesLoading);
      console.log('----');
    }
    window.location.replace(`${window.location.origin}/my-health`);
    return null;
  }

  if (!environment.isProduction() || !navigator.userAgent === 'node.js') {
    /* eslint-disable no-console */
    console.log('----');
    console.log('after if statement');
    console.log('featureMhvRouteGuards:', featureMhvRouteGuards);
    console.log('isUserLOA3:', isUserLOA3);
    console.log('hasRegisteredSystems:', hasRegisteredSystems);
    console.log('featureTogglesLoading:', featureTogglesLoading);
    console.log('----');
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
        {/* Show NoRegistrationMessage only if the feature flag is off and user is not registered */}
        {!featureMhvRouteGuards &&
          !hasRegisteredSystems && <NoRegistrationMessage />}
        {hasRegisteredSystems && <RouteComponent />}
      </Route>
    </RequiredLoginView>
  );
}
EnrolledRoute.propTypes = {
  component: PropTypes.func,
};
