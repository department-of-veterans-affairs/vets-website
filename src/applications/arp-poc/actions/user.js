export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({ type: FETCH_USER });

    const response = await new Promise(resolve => {
      setTimeout(() => {
        // resolve({
        //   firstName: "Oren",
        //   lastName: "Mittman"
        // });
        resolve(null);
      }, 1000);
    });

    dispatch({
      type: FETCH_USER_SUCCESS,
      payload: response,
    });
  };
}
