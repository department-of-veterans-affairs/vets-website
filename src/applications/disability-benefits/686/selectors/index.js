// selectors for the `authorization686` state
import { createStructuredSelector } from 'reselect';

export const get686State = createStructuredSelector({
  profileIsLoading: state => state.user.profile.loading,
  isLoggedIn: state => state.user.login.currentlyLoggedIn,
  isVerified: state => state.user.profile.verified,
  has30PercentDisability: state => state.authorization686.payload.has30Percent,
});
