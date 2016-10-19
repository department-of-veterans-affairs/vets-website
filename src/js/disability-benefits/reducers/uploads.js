import _ from 'lodash/fp';
import {
  SET_TRACKED_ITEM,
  ADD_FILE,
  REMOVE_FILE,
  SET_UPLOADING,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR,
  UPDATE_FIELD,
  SHOW_MAIL_OR_FAX,
  CANCEL_UPLOAD,
  CLEAR_UPLOADED_ITEM
} from '../actions';

import { makeField } from '../../common/model/fields';

const initialState = {
  files: [],
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploadField: makeField(''),
  showMailOrFax: false,
  uploader: null
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRACKED_ITEM: {
      return initialState;
    }
    case ADD_FILE: {
      return _.set('files', state.files.concat(Array.prototype.slice.call(action.files)), state);
    }
    case REMOVE_FILE: {
      return _.set('files', state.files.filter((file, index) => index !== action.index), state);
    }
    case SET_UPLOADING: {
      return _.merge(state, {
        uploading: action.uploading,
        uploadError: false,
        uploadComplete: false,
        uploader: action.uploader,
        uploadedItem: null
      });
    }
    case SET_PROGRESS: {
      return _.set('progress', action.progress, state);
    }
    case DONE_UPLOADING: {
      return _.merge(state, {
        uploading: false,
        uploadComplete: true,
        uploader: null,
        uploadedItem: action.itemName
      });
    }
    case SET_UPLOAD_ERROR: {
      return _.merge(state, {
        uploading: false,
        uploadError: true,
        uploader: null
      });
    }
    case UPDATE_FIELD: {
      return _.set('uploadField', action.field, state);
    }
    case SHOW_MAIL_OR_FAX: {
      return _.set('showMailOrFax', action.visible, state);
    }
    case CANCEL_UPLOAD: {
      return _.merge(state, {
        uploading: false,
        uploader: null
      });
    }
    case CLEAR_UPLOADED_ITEM: {
      return _.set('uploadedItem', null, state);
    }
    default:
      return state;
  }
}

