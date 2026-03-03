import { selectProfile, selectUser } from 'platform/user/selectors';
import { infoTokenExists } from 'platform/utilities/oauth/utilities';

/**
 * Checks if the user has an active session regardless of LOA.
 * @param {Object} state - The application state.
 * @returns {boolean} - True if the user is currently logged in.
 */
export const authenticatedUser = state =>
  selectUser(state)?.login?.currentlyLoggedIn;

/**
 * Indicates whether the "keep alive" check has been dispatched in auto SSO.
 * @param {Object} state - The application state.
 * @returns {boolean} - True if the keep-alive check has occurred.
 */
export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

/**
 * Retrieves the name of the credential service provider the user authenticated with.
 * @param {Object} state - The application state.
 * @returns {string} - The sign-in service name.
 */
export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

/**
 * Confirms if the user is authenticated with a Single Sign-On session (SSOe).
 * @param {Object} state - The application state.
 * @returns {boolean} - True if authenticated with SSOe.
 */
export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

/**
 * Confirms if the user is authenticated using OAuth or SIS.
 * @param {Object} state - The application state.
 * @returns {boolean} - True if authenticated with OAuth.
 */
export const isAuthenticatedWithOAuth = state =>
  selectProfile(state)?.session?.authBroker === 'sis' || infoTokenExists();

/**
 * Determines if the profile data is still loading.
 * @param {Object} state - The application state.
 * @returns {boolean} - True if profile is loading.
 */
export const isLoading = state => selectProfile(state)?.loading;

/**
 * Checks whether the user has completed the identity verification process.
 * @param {Object} state - The application state.
 * @returns {boolean} - True if the user is verified.
 */
export const isVerifiedUser = state => selectProfile(state)?.verified;

/**
 * Retrieves the SSOe transaction ID for the current session.
 * @param {Object} state - The application state.
 * @returns {string} - The transaction ID.
 */
export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;
