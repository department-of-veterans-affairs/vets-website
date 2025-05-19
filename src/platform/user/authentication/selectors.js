import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectProfile, selectUser } from 'platform/user/selectors';
import { infoTokenExists } from 'platform/utilities/oauth/utilities';

// returns true if user has active session reguardless of LOA
export const authenticatedUser = state =>
  selectUser(state)?.login?.currentlyLoggedIn;

// returns true when check keep alive action is dispatches in auto sso
// re
export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

// returns credential service provider that user is authenticated with in string
export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

// confirms user is authenticated with a "single sign-on" session - returns boolean
export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

// confirms user is authenticated with sign in service - returns boolean
export const isAuthenticatedWithOAuth = state =>
  selectProfile(state)?.session?.authBroker === 'sis' || infoTokenExists();

// returns true while page is loading
export const isLoading = state => selectProfile(state)?.loading;

// returns true if user previously completed the verification process
export const isVerifiedUser = state => selectProfile(state)?.verified;

// returns transaction id string for auto sso
export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;

// returns true if Sign in Service featurn flag is enabled
export const signInServiceEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.signInServiceEnabled];

// returns true if Terms of Use feature flag is enabled
export const termsOfUseEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.termsOfUse];
