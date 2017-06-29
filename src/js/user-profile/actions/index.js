export const UPDATE_PROFILE_FIELD = 'UPDATE_PROFILE_FIELD';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';

export function updateProfileField(propertyPath, value) {
  return {
    type: UPDATE_PROFILE_FIELD,
    propertyPath,
    value
  };
}

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED
  };
}
