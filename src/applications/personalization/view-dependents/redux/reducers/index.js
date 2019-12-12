
const initialState = {
  message: "yo yo yo",
};

function allDependents(state = initialState, action) {
  if(action.type == 'GET_DEPENDENTS') {
    return {
      ...state,
      message: "another one",
    };
  }
  return state;
}

export default allDependents;