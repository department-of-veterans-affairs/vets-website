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
  SHOW_MAIL_OR_FAX
} from '../actions';

import { makeField } from '../../common/model/fields';

const initialState = {
  files: [],
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploadField: makeField(''),
  showMailOrFax: false
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
    case UPDATE_FIELD: {
      return _.set('uploadField', action.field, state);
    }
    case SHOW_MAIL_OR_FAX: {
      return _.set('showMailOrFax', action.visible, state);
    }
    default:
      return state;
  }
}

