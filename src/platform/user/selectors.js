// TODO: perhaps make these selectors fail gracefully if state.user, or any of
// the properties on the user object are not defined
export const selectUser = state => state.user;
export const isLoggedIn = state => selectUser(state).login.currentlyLoggedIn;
export const selectProfile = state => selectUser(state).profile;
export const isInMVI = state => selectProfile(state).status === 'OK';
export const isProfileLoading = state => selectProfile(state).loading;
export const isLOA3 = state => selectProfile(state).loa.current === 3;
export const isLOA1 = state => selectProfile(state).loa.current === 1;
export const selectAvailableServices = state => selectProfile(state).services;
export function createIsServiceAvailableSelector(service) {
  return state => selectAvailableServices(state).includes(service);
}
