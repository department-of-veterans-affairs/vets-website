export function addRepresentative(rep) {
  return async dispatch => {
    dispatch({
      type: 'ADD_REPRESENTATIVE',
      response: rep,
    });
  };
}
