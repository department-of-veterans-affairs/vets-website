import set from 'lodash/fp/set';

const initialState = {
  currentItem: null,
  items: []
};

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRESCRIPTIONS_SUCCESS':
      return set('items', action.data.data, state);
    case 'LOAD_PRESCRIPTION_SUCCESS':
      return set('currentItem', action.data.data, state);
    default:
      return state;
  }
}
