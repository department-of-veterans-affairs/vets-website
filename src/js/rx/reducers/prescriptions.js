import set from 'lodash/fp/set';

const initialState = { items: [] };

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRESCRIPTIONS_SUCCESS':
      return set('items', action.data.data, state);
    default:
      return state;
  }
}
