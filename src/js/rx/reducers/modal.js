import set from 'lodash/fp/set';

const initialState = {
  visible: false
};

export default function modal(state = initialState, action) {
  switch (action.type) {

    // TODO: Fill out actions
    case 'CLOSE_MODAL':
      return set('visible', false, state);
    case 'OPEN_MODAL':
      return {
        visible: true
      };
    default:
      return state;
  }
}
