import { apiRequest } from '../utils/helpers';

export function getLetterList() {
  return (dispatch) => {
    apiRequest('/v0/letters',
               null,
      (response) => {
        return dispatch({
          type: 'GET_LETTERS_SUCCESS',
          data: response,
        });
      },
      () => dispatch({
        type: 'GET_LETTERS_FAILURE'
      })
    );
  };
}
