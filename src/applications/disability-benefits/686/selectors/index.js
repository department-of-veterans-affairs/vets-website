// selectors for the `authorization686` state
import { createStructuredSelector } from 'reselect';

export const get686AuthorizationState = createStructuredSelector({
  profileIsLoading: state => state.user.profile.loading,
  disabilityStatusIsLoading: state => state.authorization686.isLoading,
  // Convenience prop; are we still waiting for any data from the back-end?
  isLoading: state =>
    state.user.profile.loading || state.authorization686.isLoading,
  userStatus: state => state.user.profile.status,
  isLoggedIn: state => state.user.login.currentlyLoggedIn,
  isVerified: state => state.user.profile.verified,
  // TODO: confirm that `has30Percent` is the actual flag on the data returned
  // from the `/v0/dependents_applications/disability_rating` GET endpoint
  has30PercentDisability: state => state.authorization686.payload.has30Percent,
});
