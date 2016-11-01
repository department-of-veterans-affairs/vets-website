import set from 'lodash/fp/set';

const initialState = {
  content: '',
  status: 'info',
  visible: false
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_ALERT':
      return Object.assign({}, state, {
        content: action.content,
        status: action.status,
        visible: true
      });
    case 'CLOSE_ALERT':
      return set('visible', false, state);
    default:
      return state;
  }
}
