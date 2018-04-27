import { createSelector } from 'reselect';
import _ from 'lodash';

export const selectUser = (state) => state.user;
export const isLoggedIn = (state) => selectUser(state).login.currentlyLoggedIn;
export const selectProfile = (state) => selectUser(state).profile;
export const isProfileLoading = (state) => selectProfile(state).loading;
export const selectAvailableServices = (state) => selectProfile(state).services;
export const selectUserGreeting = createSelector(
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => window.sessionStorage.userFirstName,
  (name, email, sessionFirstName) => {
    if (name || sessionFirstName) {
      return _.startCase(_.toLower(
        name.first || sessionFirstName
      ));
    }

    return email;
  }
);
export function createIsServiceAvailableSelector(service) {
  return (state) => selectAvailableServices(state).includes(service);
}
