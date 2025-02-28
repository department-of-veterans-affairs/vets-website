/**
 * Mock user data for development and testing purposes.
 *
 * This data simulates a fully authenticated user with:
 * - LOA3 verification
 * - Required services enabled
 * - Basic profile structure
 *
 * Used automatically in development environment to bypass
 * authentication requirements and facilitate testing.
 *
 * @type {Object}
 */
export const mockUser = {
  profile: {
    verified: true,
    loa: { current: 3, highest: 3 },
    services: ['identity-proofed', 'facilities', 'user-profile'],
    loading: false,
    accountType: null,
    email: null,
    gender: null,
    status: null,
    userFullName: {
      first: null,
      middle: null,
      last: null,
      suffix: null,
    },
    vapContactInfo: {},
    session: {},
    prefillsAvailable: [],
    savedForms: [],
  },
  login: {
    currentlyLoggedIn: true,
    hasCheckedKeepAlive: true,
  },
};
