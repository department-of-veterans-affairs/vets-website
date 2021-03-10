export const DEPENDENCY_VERIFICATION_CALL_SUCCESS =
  'DEPENDENCY_VERIFICATION_CALL_SUCCESS';
export const DEPENDENCY_VERIFICATION_CALL_FAILED =
  'DEPENDENCY_VERIFICATION_CALL_FAILED';

const fakeAPICAller = () => {
  return {
    dependents: [
      {
        id: 1,
        name: 'Bill Bradsky',
        relationship: 'Spouse',
      },
    ],
  };
};

export function dependencyVerificationCall() {
  return async dispatch => {
    const response = await fakeAPICAller();
    if (response.errors) {
      dispatch({
        type: DEPENDENCY_VERIFICATION_CALL_FAILED,
        response,
      });
    } else {
      dispatch({
        type: DEPENDENCY_VERIFICATION_CALL_SUCCESS,
        response,
      });
    }
  };
}
