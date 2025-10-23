const GET_REMAINING_ENTITLEMENT_SUCCESS = 'GET_REMAINING_ENTITLEMENT_SUCCESS';

const initialState = {
  remainingEntitlement: null,
};

export function post911GIBStatus(state = initialState, action) {
  if (action.type === GET_REMAINING_ENTITLEMENT_SUCCESS) {
    return {
      ...state,
      remainingEntitlement: action.data.remainingEntitlement,
    };
  }
  return state;
}
