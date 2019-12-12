

export function getDependents() {
  return dispatch => {
      dispatch({
        type: 'GET_DEPENDENTS',
        payload: 'Hey there',
      }); 
  };
}