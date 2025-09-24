import {
  RESET_UPLOADS,
  SET_UPLOADING,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR,
  CANCEL_UPLOAD,
  SET_UPLOADER,
} from '../actions/types';

const initialState = {
  progress: 0,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploader: null,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_UPLOADS: {
      return initialState;
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
      return {
        ...state,
        progress: action.progress,
      };
    }
    case DONE_UPLOADING: {
      return {
        ...state,
        uploading: false,
        uploadComplete: true,
        uploader: null,
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
    case CANCEL_UPLOAD: {
      return {
        ...state,
        uploading: false,
        uploader: null,
      };
    }
    default:
      return state;
  }
}
