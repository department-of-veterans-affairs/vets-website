export const UPDATE_PROFILE_FIELD = 'UPDATE_PROFILE_FIELD';

export function updateProfileField(propertyPath, value) {
  return {
    type: UPDATE_PROFILE_FIELD,
    propertyPath,
    value
  };
}
