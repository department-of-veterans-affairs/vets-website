import React from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

import formConfig from './config/form';
import AddPerson from './containers/AddPerson';
import ITFWrapper from './containers/ITFWrapper';
import { MissingServices } from './containers/MissingServices';

import { MVI_ADD_SUCCEEDED } from './actions';

export const serviceRequired = [
  backendServices.FORM526,
  backendServices.ORIGINAL_CLAIMS,
];

export const hasRequiredServices = user =>
  serviceRequired.some(service => user.profile.services.includes(service));

export function Form526Entry({ location, user, children, mvi }) {
  // wraps the app and redirects user if they are not enrolled
  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
  // Not logged in, so show the rendered content. The RoutedSavableApp shows
  // an alert with the sign in button
  if (!user.login.currentlyLoggedIn) {
    return content;
  }
  // "add-person" service means the user has a edipi and SSN in the system, but
  // is missing either a BIRLS or participant ID
  if (
    user.profile.services.includes('add-person') &&
    mvi?.addPersonState !== MVI_ADD_SUCCEEDED
  ) {
    return <AddPerson />;
  }

  // RequiredLoginView checks if you're verified and shows the appropriate link
  // test user 2 doesn't have the required services. Show an alert
  if (user.profile.verified && !hasRequiredServices(user)) {
    return <MissingServices />;
  }
  return (
    <RequiredLoginView serviceRequired={serviceRequired} user={user} verify>
      <ITFWrapper location={location}>{content}</ITFWrapper>
    </RequiredLoginView>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  mvi: state.mvi,
});

export default connect(mapStateToProps)(Form526Entry);
