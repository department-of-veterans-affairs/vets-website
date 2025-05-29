/**
 * Determines if the profile has EHRM(isCerner) facilities
 * @param {user.profile} profile Current user profile.
 * @returns {Boolean} true if the profile has any EHRM(isCerner) facilities
 */
export const profileHasEHRM = ({ profile } = { profile: { facilities: [] } }) =>
  profile?.facilities?.some(facility => facility.isCerner);

/**
 * Determines if the profile has VistA(isCerner == false) facilities
 * @param {user.profile} profile Current user profile.
 * @returns {Boolean} true if the profile has any VistA(isCerner == false) facilities
 */
export const profileHasVista = (
  { profile } = { profile: { facilities: [] } },
) => profile?.facilities?.some(facility => !facility.isCerner);

/**
 * Get the user's login provider from their profile
 * @param {user.profile} profile Current user profile
 * @returns {String} The login provider name
 */
export const selectProfileLogInProvider = ({ profile }) =>
  profile?.signIn?.service;

/**
 * Get the user's LOA from their profile
 * @param {user.profile} profile Current user profile
 * @returns {Number} The user's LOA level
 */
export const selectProfileLoa = ({ profile }) => profile?.loa?.current;

/**
 * Determine if the user is a VA patient
 * @param {user.profile} profile Current user profile
 * @returns {Boolean} Whether the user is a VA patient
 */
export const selectVaPatient = ({ profile }) => profile?.isVAPatient;
