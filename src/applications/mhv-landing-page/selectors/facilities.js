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
