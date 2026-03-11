/**
 * selects the current user log in provider
 * @param {user.profile} profile Current user profile.
 * @returns {strings} ENUM'd string of the current user profile log in provider
 */
export const selectProfileLogInProvider = ({ profile } = { profile: {} }) => {
  if (!profile || !profile.signIn) {
    return '';
  }
  return profile.signIn.serviceName;
};

/**
 * selects the current user LOA
 * @param {user.profile} profile Current user profile.
 * @returns {number} the current user level
 */
export const selectProfileLoa = ({ profile } = { profile: {} }) => {
  if (!profile || !profile.loa) {
    return null;
  }
  return profile.loa.current;
};

/**
 * selects the current user isVAPatient status. This property is built by the API determined if the user has any VA facilities
 * @param {user.profile} profile Current user profile.
 * @returns {strings} ENUM'd string of the current user profile log in provider
 */
export const selectVaPatient = ({ profile } = { profile: {} }) => {
  return profile?.vaPatient;
};
