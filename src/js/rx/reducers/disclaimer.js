import set from 'lodash/fp/set';

const initialState = {
  visible: true
};

export default function disclaimer(state = initialState, action) {
  switch (action.type) {
    case 'CLOSE_DISCLAIMER':
      return set('visible', false, state);
    default:
      return state;
  }
}
