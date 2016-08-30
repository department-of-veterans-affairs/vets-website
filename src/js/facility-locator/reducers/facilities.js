const INITIAL_STATE = { facilities: [], facilityDetail: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FETCH_VA_FACILITY':
      return Object.assign({}, state, { facilityDetail: action.payload });
    default:
      return state;
  }
}
