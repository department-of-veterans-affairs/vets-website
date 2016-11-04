import set from 'lodash/fp/set';
import assign from 'lodash/fp/assign';

const initialState = {
  content: '',
  status: 'info',
  visible: false
};

export default function alert(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_ALERT':
      return {
        content: action.content,
        status: action.status,
        visible: true
      };
    case 'CLOSE_ALERT':
      return initialState;
    default:
      return state;
  }
}
