import { assign, set } from 'lodash';
import {
  RESET_UPLOADS,
  ADD_FILE,
  REMOVE_FILE,
  SET_UPLOADING,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR,
  UPDATE_FIELD,
  SHOW_MAIL_OR_FAX,
  CANCEL_UPLOAD,
  SET_FIELDS_DIRTY,
  SET_UPLOADER,
} from '../actions/index.jsx';

import { makeField, dirtyAllFields } from 'platform/forms/fields';

const initialState = {
  files: [],
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploadField: makeField(''),
  showMailOrFax: false,
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
      return set(state, 'files', state.files.concat(files));
    }
    case REMOVE_FILE: {
      return set(
        state,
        'files',
        state.files.filter((file, index) => index !== action.index),
      );
    }
    case SET_UPLOADING: {
      return assign(state, {
        uploading: action.uploading,
        uploadError: false,
        uploadComplete: false,
        uploader: action.uploader,
      });
    }
    case SET_UPLOADER: {
      return assign(state, {
        uploader: action.uploader,
      });
    }
    case SET_PROGRESS: {
      return set(state, 'progress', action.progress);
    }
    case DONE_UPLOADING: {
      return assign(state, {
        uploading: false,
        uploadComplete: true,
        uploader: null,
        files: [],
      });
    }
    case SET_UPLOAD_ERROR: {
      return assign(state, {
        uploading: false,
        uploadError: true,
        uploader: null,
      });
    }
    case UPDATE_FIELD: {
      return set(state, action.path, action.field);
    }
    case SHOW_MAIL_OR_FAX: {
      return set(state, 'showMailOrFax', action.visible);
    }
    case CANCEL_UPLOAD: {
      return assign(state, {
        uploading: false,
        uploader: null,
      });
    }
    case SET_FIELDS_DIRTY: {
      return dirtyAllFields(state);
    }
    default:
      return state;
  }
}
