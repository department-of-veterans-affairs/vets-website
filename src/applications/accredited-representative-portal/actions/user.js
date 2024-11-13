export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({
      type: FETCH_USER,
    });

    try {
      /**
       * This is an even stricter success condition than having a user. We
       * additionally require what is needed for access token refreshing to
       * function.
       */
      const user = {
        account: {
          accountUuid: '88f572d491af46efa393cba6c351e252',
        },
        profile: {
          firstName: 'William',
          lastName: 'Phelps',
          verified: true,
          signIn: {
            serviceName: 'idme',
          },
        },
        prefillsAvailable: [],
        inProgressForms: [],
      };
      const serviceName = user?.profile?.signIn?.serviceName;
      if (!serviceName)
        throw new Error('Missing user with sign in service name.');

      // Needed for access token refreshing to function.
      sessionStorage.setItem('serviceName', serviceName);

      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: user,
      });
    } catch (e) {
      const error =
        e.errors?.[0]?.detail ||
        e.message ||
        'Unknown error while fetching user';

      dispatch({
        type: FETCH_USER_FAILURE,
        error,
      });
    }
  };
}
