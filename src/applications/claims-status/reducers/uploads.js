import { makeField, dirtyAllFields } from 'platform/forms/fields';
import set from 'platform/utilities/data/set';

import {
  RESET_UPLOADS,
  ADD_FILE,
  REMOVE_FILE,
  SET_UPLOADING,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR,
  UPDATE_FIELD,
  CANCEL_UPLOAD,
  SET_FIELDS_DIRTY,
  SET_UPLOADER,
} from '../actions/types';

const initialState = {
  files: [],
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploadField: makeField(''),
  uploader: null,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_UPLOADS: {
      return initialState;
    }
    case ADD_FILE: {
      const files = Array.prototype.map.call(action.files, file => ({
        file,
        docType: makeField(''),
        password: makeField(''),
        isEncrypted: action.isEncrypted,
      }));
      return set('files', state.files.concat(files), state);
    }
    case REMOVE_FILE: {
      return set(
        'files',
        state.files.filter((file, index) => index !== action.index),
        state,
      );
    }
    case SET_UPLOADING: {
      return {
        ...state,
        uploading: action.uploading,
        uploadError: false,
        uploadComplete: false,
        uploader: action.uploader,
      };
    }
    case SET_UPLOADER: {
      return {
        ...state,
        uploader: action.uploader,
      };
    }
    case SET_PROGRESS: {
      return set('progress', action.progress, state);
    }
    case DONE_UPLOADING: {
      return {
        ...state,
        uploading: false,
        uploadComplete: true,
        uploader: null,
        files: [],
      };
    }
    case SET_UPLOAD_ERROR: {
      return {
        ...state,
        uploading: false,
        uploadError: true,
        uploader: null,
      };
    }
    case UPDATE_FIELD: {
      return set(action.path, action.field, state);
    }
    case CANCEL_UPLOAD: {
      return {
        ...state,
        uploading: false,
        uploader: null,
      };
    }
    case SET_FIELDS_DIRTY: {
      return dirtyAllFields(state);
    }
    default:
      return state;
  }
}
