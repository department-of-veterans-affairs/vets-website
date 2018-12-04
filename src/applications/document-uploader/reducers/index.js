import { SET_VETERAN, SET_FILES, SET_COMMENTS, SET_STATUS } from '../actions';

const initialState = {
  veteran: {
    firstName: '',
    lastName: '',
    email: '',
    fileNumber: '',
  },
  comments: '',
  files: [],
  status: 'initial',
};

function documentUploader(state = initialState, action) {
  switch (action.type) {
    case SET_VETERAN:
      return { ...state, veteran: action.veteran };
    case SET_FILES:
      return { ...state, files: action.files };
    case SET_COMMENTS:
      return { ...state, comments: action.comments };
    case SET_STATUS:
      return { ...state, status: action.status };
    default:
      return state;
  }
}

export default {
  documentUploader,
};
