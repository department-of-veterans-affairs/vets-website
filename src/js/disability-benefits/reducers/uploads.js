import _ from 'lodash/fp';
import {
  SET_TRACKED_ITEM,
  ADD_FILE,
  REMOVE_FILE,
  SET_UPLOADING,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR
} from '../actions';

const initialState = {
  files: [],
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRACKED_ITEM: {
      return initialState;
    }
    case ADD_FILE: {
      return _.set('files', [...state.files, action.file], state);
    }
    case REMOVE_FILE: {
      return _.set('files', state.files.filter((file, index) => index !== action.index), state);
    }
    case SET_UPLOADING: {
      return _.merge(state, {
        uploading: action.uploading,
        uploadError: false,
        uploadComplete: false
      });
    }
    case SET_PROGRESS: {
      return _.set('progress', action.progress, state);
    }
    case DONE_UPLOADING: {
      return _.merge(state, {
        uploading: false,
        uploadComplete: true
      });
    }
    case SET_UPLOAD_ERROR: {
      return _.merge(state, {
        uploading: false,
        uploadError: true
      });
    }
    default:
      return state;
  }
}

